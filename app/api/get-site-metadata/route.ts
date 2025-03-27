import { unbody } from '@/lib/unbody'
import { NextResponse } from 'next/server'
import type { SiteMetadata } from '@/types/site.metadata'

export async function POST() {
  try {
    const { data } = 
    await unbody.get
                .collection<SiteMetadata>("Website")
                .select("xSummary", "title", "description", "url", "xClients", "xIndustries", "xFaQ")
                .exec()


    if (!data.payload[0]) {
      throw new Error("No site metadata found")
    }

    return NextResponse.json(data.payload[0])

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 