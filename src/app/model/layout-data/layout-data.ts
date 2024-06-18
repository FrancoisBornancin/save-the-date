import { TextData } from "./text-data";

export interface LayoutData {
    key: number;
    height: number;
    width: number;
    opacity: number;
    imageBackgroundColor: string;
    textData: TextData,  
    hasBeenSaved: string;
}
