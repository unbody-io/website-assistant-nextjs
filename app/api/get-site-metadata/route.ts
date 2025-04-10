import { unbody } from "@/lib/unbody";
import { project } from "@/lib/unbody/project"
import { ExtendedImageBlock } from "@/types/data.types";
import { SiteMetadata } from "@/types/site.metadata";
import { NextResponse } from "next/server"
import { UnbodyAdmin } from "unbody/admin"

const admin = new UnbodyAdmin({
  auth: {
      username: process.env.UNBODY_ADMIN_ID,
      password: process.env.UNBODY_ADMIN_SECRET,
  },
});

export async function POST(request: Request) {
  try {
    const { source_name } = await request.json()

    if (!source_name) {
      return NextResponse.json(
        { error: "Source name is required" },
        { status: 400 }
      )
    }
  
    if(!process.env.UNBODY_ADMIN_ID || !process.env.UNBODY_ADMIN_SECRET) {
      throw new Error("UNBODY_ADMIN_ID and UNBODY_ADMIN_SECRET must be set")
    }

    // Get the source from Unbody
    const project = await admin.projects.get({
      id: process.env.UNBODY_PROJECT_ID as string
    })

    const sources = await project.sources.list({});
    const source = sources.sources.find((source) => source.name === source_name);

    console.log("source name", source_name)
    console.log("source", source)
    
    if (!source) {
      return NextResponse.json(
        { error: "Source not found" },
        { status: 404 }
      )
    }

    const { data: {payload} } = 
    await unbody.get
                .collection<SiteMetadata>("Website")
                .where({
                  sourceId: source.id
                })
                .select("xSummary", "title", "description", "url", "xClients", "xIndustries", "xFaQ")
                .exec()

    const {data: {payload: logo}} = await unbody.get
                .collection<ExtendedImageBlock>("ImageBlock")
                .where(({And}) => {
                  return And(
                    {
                      xLabel: "logo",
                    },
                    {
                      xWebsiteName: source_name
                    }
                  )
                })
                .select("url")
                .exec()

    if(!payload || payload.length === 0) {
      return NextResponse.json(
        { error: "No site metadata found" },
        { status: 404 }
      )
    }
    

    return NextResponse.json({
      siteMetadata: {
        ...payload[0] as SiteMetadata,
        logo: logo[0] as ExtendedImageBlock | null
      },
      source,
    })
  } catch (error) {
    console.error("Error fetching site metadata:", error)
    return NextResponse.json(
      { error: "Failed to fetch site metadata" },
      { status: 500 }
    )
  }
} 