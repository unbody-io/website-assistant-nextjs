import { IWebsite } from "unbody";
import { ExtendedImageBlock } from "./data.types";
export type SiteMetadata = {
    xSummary: string;
    xClients: string;
    xIndustries: string;
    xFaQ: string;
    logo: ExtendedImageBlock | null;
} & IWebsite;