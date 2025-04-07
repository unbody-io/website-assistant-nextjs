import {CustomSchema} from "unbody/admin";

const schema = new CustomSchema.Collection('ImageBlock').add(
    new CustomSchema.Field.Text('xLabel', 'Labels for the image; e.g; logo, etc', false),
    new CustomSchema.Field.Text('xWebsiteName', 'The name of the website', false),
);

export default schema;
