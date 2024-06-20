import { BackgroundData } from "./background-data";
import { TextData } from "./text-data";

export interface LayoutData {
    key: number;
    backgroundData: BackgroundData,
    textData: TextData,  
    hasBeenSaved: string;
}
