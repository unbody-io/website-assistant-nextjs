import {
    ProjectSettings,
    TextVectorizer,
    Enhancement,
    UnbodyAdmin, Generative, Reranker, AutoSummary, AutoVision,
    SourceTypes, CustomSchema,
} from 'unbody/admin'

import appContextPipeline from "@/scripts/enhancements/website.enhancer";
import pageEnhancementPipeline from "@/scripts/enhancements/webpage.enhancer";
import extendedWebPageSchema from "@/scripts/enhancements/webpage.xschema";
import extendedWebsiteSchema from "@/scripts/enhancements/website.xschema";
import extendedImageSchema from "@/scripts/enhancements/image.xschema";

if(!process.env.UNBODY_ADMIN_ID || !process.env.UNBODY_ADMIN_SECRET) {
    throw new Error("UNBODY_ADMIN_ID and UNBODY_ADMIN_SECRET must be set")
}

const admin = new UnbodyAdmin({
    auth: {
        username: process.env.UNBODY_ADMIN_ID,
        password: process.env.UNBODY_ADMIN_SECRET,
    },
});

const settings = new ProjectSettings()
settings
    .set(new TextVectorizer(TextVectorizer.OpenAI.TextEmbedding3Large))
    .set(new Generative(Generative.OpenAI.GPT4o))
    .set(new Reranker(Reranker.Cohere.EnglishV3))
    .set(new AutoSummary(AutoSummary.OpenAI.GPT4oMini))
    .set(new AutoVision(AutoVision.OpenAI.GPT4o))

// Enhancement - Extended schemas
settings.set(
    new CustomSchema().extend(
        extendedWebsiteSchema,
        extendedWebPageSchema,
        extendedImageSchema
    )
);

// Enhancement pipelines
settings.set(
    new Enhancement().add(
        appContextPipeline,
        pageEnhancementPipeline
    )
);

export const run = async () => {
    const requirements = [
        'UNBODY_ADMIN_ID',
        'UNBODY_ADMIN_SECRET'
    ];

    for (const requirement of requirements) {
        if (!process.env[requirement]) {
            throw new Error(`Missing environment variable: ${requirement}`);
        }
    }

    try{
        const project = await admin.projects
                                    .ref({name: "companies_website", settings})
                                    .save()

        // Create a push api source for custom data (e.g; avatar, etc)
        const source = await project.sources.ref({
            name: "cutsom-data",
            type: SourceTypes.PushApi,
        }).save()

        await source.initialize()

        console.log(`Project ${project.name} created successfully`)
        console.log("https://app.unbody.io/projects/" + project.id);
        console.log("https://app.unbody.io/sources/" + source.id);
    } catch (error: any) {
        console.log(JSON.stringify(error.response?.data))
    }

}