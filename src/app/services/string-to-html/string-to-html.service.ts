import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringToHtmlService {

  constructor() { }

  replaceString(stringToReplace: string): string{
    const startString = "<p>"
    const endString = "</p>"
    stringToReplace = this.replace(stringToReplace, '|', '<br>');
    stringToReplace = this.replaceAndSurround(stringToReplace, ':it:', '<em>');
    stringToReplace = this.replaceAndSurround(stringToReplace, ':gr:', '<strong>');
    // stringToReplace = this.replacePuce(stringToReplace, ':p:');
    return stringToReplace;
  }

  private replacePuce(initialText: string, initialElement: string): string{
    // split with <br> puis split les différents éléments avec :p:



    return '';
  }

  private replaceAndSurround(initialText: string, initialElement: string, replacementElement: string){
    const openBalise: string = replacementElement;
    let closeBalise: string = replacementElement.substring(1, replacementElement.length);
    closeBalise = "</" + closeBalise;

    const splittedText = initialText.split(initialElement);
    let stringRecontructed = "";
    if(initialText.startsWith(initialElement)){
      stringRecontructed = this.reconstructString(1, splittedText, openBalise, closeBalise);
    }else{
      stringRecontructed = this.reconstructString(0, splittedText, openBalise, closeBalise);
    }
    return stringRecontructed;
  }

  private reconstructString(startIndex: number, splittedText: string[], openBalise: string, closeBalise: string): string{
    let stringRecontructed = '';
    for(let a = startIndex ; a < splittedText.length ; a++){
      if(a % 2 != 0){
        stringRecontructed += (openBalise + splittedText[a] + closeBalise);
      }else{
        stringRecontructed += splittedText[a];
      }
    }
    return stringRecontructed;
  }

  private replace(initialText: string, initialElement: string, replacementElement: string): string{
    const splittedText: string[] = initialText.split(initialElement);
    return splittedText.join(replacementElement); 
  }
}
