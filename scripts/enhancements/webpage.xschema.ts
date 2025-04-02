import {CustomSchema} from "unbody/admin";

const schema = new CustomSchema.Collection('WebPage').add(
    new CustomSchema.Field.Text('xCategory', 'Category of the webpage', false),
)
export default schema;
