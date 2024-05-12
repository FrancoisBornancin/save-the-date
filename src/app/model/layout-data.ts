import { CustomImageData } from "./image-data";

export interface LayoutData {
    key: number;
    mainBackgroundColor: string;
    imageBackgroundColor: string;
    imageText: string;
    imageData: CustomImageData
    hasBeenSaved: string;
}
