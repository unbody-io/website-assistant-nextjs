import {Enhancement} from "unbody/admin";
import {pageCategories} from "@/scripts/page-categories.config";

const pageEnhancementPipeline = new Enhancement.Pipeline("page_enhancement", "WebPage", {
    vars: {
        categories: pageCategories.map(u => u.key)
    }
});

pageEnhancementPipeline.add(
    new Enhancement.Step(
        "extract_metadata",
        new Enhancement.Action.StructuredGenerator({
            prompt: (ctx) => `Extract the requested details of the health care provider from the report provided.
            - which category does this page belong to?
            ---
            all available categories:
            ${JSON.stringify(ctx.vars.categories)}
            ---
            Page content:
            ${ctx.record.text} 
            ---
            `,
            model: "openai-gpt-4o",
            schema: (ctx, {z}) => z.object({
                category: z.enum(ctx.vars.categories as [string, ...string[]]).nullable().default('').describe("Category of the webpage"),
            }),
        }),
        {
            output: {
                xCategory: ctx => ctx.result.json.category
            }
        }
    )
);

export default pageEnhancementPipeline;
