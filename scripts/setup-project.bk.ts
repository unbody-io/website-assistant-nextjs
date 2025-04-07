// import {
//     ProjectSettings,
//     TextVectorizer,
//     Enhancement,
//     UnbodyAdmin, Generative, Reranker, AutoSummary, AutoVision,
//     SourceTypes, CustomSchema,
// } from 'unbody/admin'
//
// import appContextPipeline from "@/scripts/enhancements/website.enhancer";
// import pageEnhancementPipeline from "@/scripts/enhancements/webpage.enhancer";
// import extendedWebPageSchema from "@/scripts/enhancements/webpage.xschema";
// import extendedWebsiteSchema from "@/scripts/enhancements/website.xschema";
//
// const settings = new ProjectSettings()
//
// settings
//     .set(new TextVectorizer(TextVectorizer.OpenAI.TextEmbedding3Large))
//     .set(new Generative(Generative.OpenAI.GPT4o))
//     .set(new Reranker(Reranker.Cohere.EnglishV3))
//     .set(new AutoSummary(AutoSummary.OpenAI.GPT4oMini))
//     .set(new AutoVision(AutoVision.OpenAI.GPT4o))
//
// // Enhancement - Extended schemas
// settings.set(
//     new CustomSchema().extend(
//         extendedWebsiteSchema,
//         extendedWebPageSchema
//     )
// );
//
// // Enhancement pipelines
// settings.set(
//     new Enhancement().add(
//         appContextPipeline,
//         pageEnhancementPipeline
//     )
// );
//
// export const run = async () => {
//     const requirements = [
//         'UNBODY_ADMIN_ID',
//         'UNBODY_ADMIN_SECRET',
//         'WEBSITE_NAME',
//         'WEBSITE_URL',
//     ];
//
//     for (const requirement of requirements) {
//         if (!process.env[requirement]) {
//             throw new Error(`Missing environment variable: ${requirement}`);
//         }
//     }
//     const admin = new UnbodyAdmin({
//         auth: {
//             username: process.env.UNBODY_ADMIN_ID,
//             password: process.env.UNBODY_ADMIN_SECRET,
//         },
//     });
//
//     const project = await admin.projects
//         .ref({name: `${process.env.WEBSITE_NAME} project testing - 2`, settings})
//         .save()
//         .catch((e) => {
//             console.log(JSON.stringify(e.response.data, null, 2))
//             throw e;
//         })
//
//     console.log("Project created with ID:", project.id)
//
//     const source = await project.sources.ref({
//         name: process.env.WEBSITE_NAME,
//         type: SourceTypes.WebCrawler
//     }).save()
//     console.log("Source created with ID:", source.id)
//
//     await source.setEntrypoint({
//         entrypoint: {
//             url: process.env.WEBSITE_URL,
//             maxDepth: 2,
//             maxPages: 10,
//             jsEnabled: false
//         },
//     })
//     console.log("Entrypoint set: ", process.env.WEBSITE_URL)
//
//     await source.initialize();
//     console.log("Initializing source... (this may take a few minutes) Check the dashboard for progress.")
//     console.log("https://app.unbody.io/projects/" + project.id + "/sources/" + source.id);
// }
