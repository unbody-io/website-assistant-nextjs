import { NextResponse } from "next/server"
import { z } from "zod"
import { UnbodyAdmin, Source } from "unbody/admin"
import { UnbodyPushAPI } from "unbody/push"
import { AxiosError, toFormData } from "axios"
import { v4 as uuidv4 } from 'uuid';

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-z0-9_]+$/, "Name can only contain lowercase letters, numbers, and underscores")
    .transform((val) => val.toLowerCase()),
})

const admin = new UnbodyAdmin({
  auth: {
      username: process.env.UNBODY_ADMIN_ID,
      password: process.env.UNBODY_ADMIN_SECRET,
  },
});

// GET /api/sources
export async function GET() {
  try {
    const project = await admin.projects.get({
      id: process.env.UNBODY_PROJECT_ID as string,
    });

    if(!project) {
      throw new Error("Project not found")
    }
    const sources = await project.sources.list({})

    return NextResponse.json(
      sources.sources.filter((source) => source.type === "web_crawler")
    )
  } catch (error) {
    console.error("Error fetching sources:", error)
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    )
  }
}

// POST /api/sources
export async function POST(request: Request) {
  try {
    const project = await admin.projects.get({
      id: process.env.UNBODY_PROJECT_ID as string,
    });

    if(!project) {
      throw new Error("Project not found")
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const url = formData.get("url") as string
    const file = formData.get("file") as File

    const validatedData = formSchema.parse({ name, url })

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    if (file.size > 5000000) {
      return NextResponse.json(
        { error: "Image must be less than 5MB" },
        { status: 400 }
      )
    }

    const websiteSource = await project.sources.ref({
      name: validatedData.name,
      type: "web_crawler",
    }).save()


    await websiteSource.setEntrypoint({
      entrypoint:{
        url: validatedData.url,
        maxDepth: 2,
        maxPages: 100,
        jsEnabled: true,
      }
    })

    await websiteSource.initialize()

    const push = new UnbodyPushAPI({
      auth: {
          apiKey: process.env.UNBODY_API_KEY as string,
      },
      projectId: process.env.UNBODY_PROJECT_ID as string,
      sourceId: process.env.UNBODY_CUSTOM_DATA_SOURCE_ID as string,
  })

    const form = toFormData({})
    form.append('id', uuidv4()) 
    form.append('payload', JSON.stringify({
      xLabel: "logo",
      xWebsiteName: validatedData.name,
    }))
    form.append('file', Buffer.from(await file.arrayBuffer()), file.name)

    await push.files.upload({form})
    await project.sources.ref({id: process.env.UNBODY_CUSTOM_DATA_SOURCE_ID, type: "push_api"}).update()
    
    // return NextResponse.json(websiteSource)
    return NextResponse.json({
      message: "Source created successfully"
    })

  } catch (error: any) {
    
    if (error.response)   console.error(JSON.stringify(error.response.data, null, 2))

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof AxiosError && !!error.response)
      console.error(error.status, error.response.data)
    else console.error(error)

    return NextResponse.json(
      { error: "Failed to create source" },
      { status: 500 }
    )
  }
}
