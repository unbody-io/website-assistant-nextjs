import {CustomSchema} from "unbody/admin";

const schema = new CustomSchema.Collection('Website').add(
    new CustomSchema.Field.Text('xSummary', 'Overall generated summary from all pages on the website', false),
    new CustomSchema.Field.Text('xFaQ', 'List of top 10 FAQ\'s of the website', false),
    new CustomSchema.Field.Text('xClients', 'List of clients of the website', true),
    new CustomSchema.Field.Text('xIndustries', 'List of industries of the website', true),
)

export default schema;
