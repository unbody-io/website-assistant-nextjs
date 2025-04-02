import { unbody } from "@/lib/unbody"
import { ParsedQuery, parseQuery } from "@/lib/unbody/unbody.utils"
import { ExtendedWebPage } from "@/types/data.types"
import { SiteMetadata } from "@/types/site.metadata"
import { IImageBlock } from "unbody"
import { z } from "zod"

type ParsedQueryAdditional = {
    clients: string[]
    industries: string[]
}

// Simulated Unbody API
const api = {

  understand: async (query: string, siteMetadata: SiteMetadata) => {
    const parsedQuery = await parseQuery<ParsedQueryAdditional>({
      query,
      schema: z.object({
        clients: z.array(z.string()).nullable().optional().default([]).describe("Clients/customer names that the user is interested in."),
        industries: z.array(z.string()).nullable().optional().default([]).describe("Industries that the user is interested in."),
      }),
      guide: `
      You are an agent (query parser) as part of a larger RAG pipeline. 
      This pipeline is used to answer questions or search for information on a website of a software development company: 
      ${siteMetadata.xSummary}
      `,
    })
    console.log(parsedQuery)
    return parsedQuery
  },

  search: async (query: ParsedQuery<any>): Promise<{webpages: ExtendedWebPage[], images: IImageBlock[]}> => {
    const {data: {payload: pages}} = await unbody.get
      .collection<ExtendedWebPage>("WebPage")
      .search.about(query.query, {
        moveTo: {
          concepts: query.concepts || [query.query],
          force: 0.6
        },
      })
      .select(
        "title", "url", "description", "xCategory", "__typename",
        "blocks.ImageBlock.url"
      )
      .autocut(3)
      .limit(3)
      .exec();

    const {data: {payload: images}} = await unbody.get
      .imageBlock
      .search.about(query.query, {
        moveTo: {
          concepts: query.concepts || [query.query],
          force: 0.6
        },
        // certainty: 0.75,
      })
      .select("url", "autoCaption", "autoOCR", "__typename")
      .autocut(3)
      .limit(3)
      .exec();

    return {
      webpages: pages as ExtendedWebPage[],
      images: images as IImageBlock[],
    }
  },

  think: async (query: ParsedQuery<any>, searchResults: ExtendedWebPage[], siteMetadata: SiteMetadata) => {
    console.log("think", query, searchResults, siteMetadata)
    const {
      // @ts-ignore
      data: {
        payload: { content },
      },
    } = await unbody.generate.json(
      [
        {
          role: 'system',
          content: `You're an assistant on our recipe book website. Answer the user's query based on the user's intent and the recipes we have found based on the user query.`,
        },
        {
          role: 'system',
          content: `Here are the relevant pages we've found: ${searchResults.map((page) => `${page.title}/n${page.text}/n${page.url}`).join("---/n/n---")}`,
        },
        {
          role: 'system',
          content: `Additional context about the company: ${siteMetadata.xSummary}`,
        },
        {
          role: 'user',
          content: query.query,
        },
      ],
      {
        model: 'gpt-4o',
        schema: z.object({
          answer: z.string().describe("An elaborate answer to the user's query."),
          followups: z.array(z.string()).describe("Follow-up questions that the user might ask."),
        }),
      }
    ).catch((error) => {
      console.error("Error generating response", error.response)
      return {response: {answer: "An error occurred", followups: []}}
    });

    return {response: content}
  }
}


export async function POST(req: Request) {
  const { query, siteMetadata } = await req.json()
  // Create a stream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Helper function to send events
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        }

        // Step 1: Understanding
        sendEvent("status", {
          key: "understanding",
          isBusy: true,
          ready: false,
          label: "Understanding your question...",
        })

        const parsedQuery = await api.understand(query, siteMetadata)

        sendEvent("query-parser", parsedQuery)

        sendEvent("status", {
          key: "understanding",
          isBusy: false,
          ready: true,
          label: "Understood your question",
        })

        // Step 2: Searching
        sendEvent("status", {
          key: "searching",
          isBusy: true,
          ready: false,
          label: "Searching for relevant information...",
        })

        const searchResult = await api.search(parsedQuery)

        sendEvent("status", {
          key: "searching",
          isBusy: false,
          ready: true,
          label: "Found relevant information",
        })

        sendEvent("results", {
          webpages: searchResult.webpages,
          images: searchResult.images,
        })

        // Step 3: Thinking
        sendEvent("status", {
          key: "thinking",
          isBusy: true,
          ready: false,
          label: "Generating response...",
        })

        const thinkResult = await api.think(parsedQuery, searchResult.webpages, siteMetadata)
        sendEvent("status", {
          key: "thinking",
          isBusy: false,
          ready: true,
          label: "Generated response",
        })
        sendEvent("response", thinkResult.response)
        // Complete
        sendEvent("processing", { stage: "complete", message: "Processing complete" })
      } catch (error) {
        // Send error event
        controller.enqueue(
          new TextEncoder().encode(`event: error\ndata: ${JSON.stringify({ message: "An error occurred" })}\n\n`),
        )
      } finally {
        controller.close()
      }
    },
  })

  // Return the stream as a response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

