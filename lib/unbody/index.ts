import { Unbody } from "unbody"

console.log("Unbody key: ", process.env.UNBODY_API_KEY)
console.log("Unbody project id: ", process.env.UNBODY_PROJECT_ID)

if (!process.env.UNBODY_API_KEY || !process.env.UNBODY_PROJECT_ID) {
  throw new Error("UNBODY_API_KEY and UNBODY_PROJECT_ID must be set")
}

export const unbody = new Unbody({
  apiKey: process.env.UNBODY_API_KEY,
  projectId: process.env.UNBODY_PROJECT_ID,
})
