import { Injectable } from '@angular/core';
import { TextToHtml } from '../../model/text-to-html';
import { TextToHtmlRetrieverService } from '../text-to-html-retriever/text-to-html-retriever.service';

@Injectable({
  providedIn: 'root'
})
export class StringToHtmlService {

  constructor(
    private textToHtmlRetriever: TextToHtmlRetrieverService
  ) { }

  replaceString(stringToReplace: string): string{
    if(stringToReplace != undefined){
      const startString = "<p style='color: rgba(0, 0, 0, 1)'>"
      const endString = "</p>"
      stringToReplace = this.replace(stringToReplace, this.textToHtmlRetriever.getText('saut_de_ligne'), this.textToHtmlRetriever.getHtml('saut_de_ligne'));
      stringToReplace = this.replaceAndSurround(stringToReplace, this.textToHtmlRetriever.getText('italique'), this.textToHtmlRetriever.getHtml('italique'));
      stringToReplace = this.replaceAndSurround(stringToReplace, this.textToHtmlRetriever.getText('gras'), this.textToHtmlRetriever.getHtml('gras'));
      stringToReplace = this.replacePuce(stringToReplace, this.textToHtmlRetriever.getText('liste à puce'));
    }
    return stringToReplace;
  }

  private replacePuce(initialText: string, initialElement: string): string{
    const openBalise: string = '<ul><li>';
    const closeBalise: string = '</li></ul>';

    if(initialText.includes(initialElement)){
      if(initialText.includes('<br>')){
        const splittedText: string[] = initialText.split('<br>');
        const stringReconstructed =
        splittedText.map(element => this.reconstructPuce(element, initialElement, openBalise, closeBalise))
                    .join('<br>');
        return splittedText.map(element => this.reconstructPuce(element, initialElement, openBalise, closeBalise))
                    .join('<br>');
      }else{
        return this.reconstructPuce(initialText, initialElement, openBalise, closeBalise);
      }
    }else{
      return initialText;
    }
  }

  private reconstructPuce(initialText: string, initialElement: string, openBalise: string, closeBalise: string): string{
    if(initialText.includes(initialElement)){
      let stringRecontructed = '';
      const splittedText = initialText.split(initialElement);
      if(initialText.startsWith(initialElement)){
        for(let a = 1 ; a < splittedText.length ; a++){
            stringRecontructed += (openBalise + splittedText[a] + closeBalise);
        }
      }else{
        stringRecontructed += splittedText[0];
        for(let a = 1 ; a < splittedText.length ; a++){
          stringRecontructed += (openBalise + splittedText[a] + closeBalise);
        }
      }
      return stringRecontructed;
    }else{
      return initialText;
    }
  }

  private replaceAndSurround(initialText: string, initialElement: string, replacementElement: string){
    if(initialText.includes(initialElement)){
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
    }else {
      return initialText;
    }
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
    if(initialText.includes(initialElement)){
      const splittedText: string[] = initialText.split(initialElement);
      return splittedText.join(replacementElement);
    }else{
      return initialText;
    }
  }
}
