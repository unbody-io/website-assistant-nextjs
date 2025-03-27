import { IWebsite } from "unbody";

export type SiteMetadata = {
    xSummary: string;
    xClients: string;
    xIndustries: string;
    xFaQ: string;
} & IWebsite;