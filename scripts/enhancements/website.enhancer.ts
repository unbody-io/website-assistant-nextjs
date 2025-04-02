import {Enhancement} from "unbody/admin";

const appContextPipeline = new Enhancement.Pipeline("extract_website_context", "Website");

appContextPipeline.add(
    new Enhancement.Step(
        "extract_summary",
        new Enhancement.Action.Summarizer({
            model: "openai-gpt-4o",
            text: ctx => ctx.record.pages.map((page: any)=>page.text).join("\n"),
            metadata: "",
            prompt: `
You are tasked with reading and synthesizing the full text content extracted from multiple pages of a software development agency’s website. Your objective is to generate a comprehensive overall summary that captures the most critical aspects of the agency. This summary will be stored in the knowledge base for later retrieval and use by a chatbot answering diverse queries.

Please ensure your summary includes the following details where available:
1. **Company Overview:** A brief description of the agency, including its mission, core values, and overall market positioning.
2. **Services Offered:** An outline of the software development services and solutions provided.
3. **Clients:** Identification of key clients that they have served or collaborated with. (if available)
4. **Experience & Expertise:** Highlights of notable projects, case studies, and areas of technical expertise.
5. **Team & Leadership:** Information on the team structure, focusing on key leadership figures (e.g., CEO, founders) and overall staffing.
6. **Contact Information:** A summary of available contact details such as email, phone, physical address, and social media links.
7. **Additional Highlights:** Any awards, recognitions, testimonials, or news that further showcase the agency’s strengths.
8. **Top 10 FAQ's** Top 10 FAQ's (including questions and answers) of the website.
10. **Industries Served** Industries that the agency has served or is serving.
11. **Any other relevant information**

If any of these aspects are missing from the provided content, omit them gracefully. Your final response should be a clear, well-organized narrative that integrates these points cohesively.

---
Metadata:
{metadata}

Content of the pages:
{text}
---`
        }),
        {
            output: {
                xSummary: ctx => ctx.result.summary
            }
        }
    )
);

appContextPipeline.add(
    new Enhancement.Step(
        "extract_json",
        new Enhancement.Action.StructuredGenerator({
            prompt: (ctx) => `Extract the requested details of the pages from the company website.
            ${ctx.steps.extract_summary.output.xSummary}
            `,
            model: "openai-gpt-4o",
            schema: (ctx, {z}) => z.object({
                faq: z.array(
                    z.object({
                        question: z.string().nullable().default('').describe("Question"),
                        answer: z.string().nullable().default('').describe("Answer"),
                    })
                ).nullable().default([]).describe('List of top 10 FAQ\'s of the page'),

                clients: z.array(
                    z.string().nullable().default('').describe("Client name")
                ).nullable().default([]).describe('List of clients of the website'),

                industries: z.array(
                    z.string().nullable().default('').describe("Industry name")
                ).nullable().default([]).describe('List of industries of the website')
            }),
        }),
        {
            output: {
                xFaQ: ctx => ctx.result.json.faq? ctx.result.json.faq.map(faq => `${faq.question}\n${faq.answer}`).join("\n\n") : "",
                xClients: ctx => ctx.result.json.clients,
                xIndustries: ctx => ctx.result.json.industries
            }
        }
    )
)

export default appContextPipeline;
