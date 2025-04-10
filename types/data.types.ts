import { IImageBlock, IWebPage } from "unbody";

export interface ExtendedWebPage extends IWebPage {
    xCategory: string
}

export interface ExtendedImageBlock extends IImageBlock {
    xWebsiteName: string
    xLabel: string
}