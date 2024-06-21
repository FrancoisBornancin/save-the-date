import { BackgroundData } from "./background-data copy";
import { BorderData } from "./border-data";
import { TextData } from "./text-data";

export interface LayoutData {
    key: number;
    backgroundData: BackgroundData,
    textData: TextData,  
    borderData: BorderData,
    hasBeenSaved: string;
}
