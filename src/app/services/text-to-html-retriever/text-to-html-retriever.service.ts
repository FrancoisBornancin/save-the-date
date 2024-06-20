import { Injectable } from '@angular/core';
import { TextToHtml } from '../../model/text-to-html';

@Injectable({
  providedIn: 'root'
})
export class TextToHtmlRetrieverService {
  textToHtml: TextToHtml[] = [
    {
      name: 'saut_de_ligne',
      text: '|',
      html: '<br>',
      surround: false
    },
    {
      name: 'italique',
      text: ':it:',
      html: '<em>',
      surround: true
    },
    {
      name: 'gras',
      text: ':gr:',
      html: '<strong>',
      surround: true
    },
    {
      name: 'liste à puce',
      text: ':p:',
      html: '<ul><li>',
      surround: false
    },
  ]

  getText(name: string): string{
    return this.textToHtml
      .filter(element => element.name == name)
      .map(element => element.text)
      .at(0)!
  }

  getHtml(name: string): string{
    return this.textToHtml
      .filter(element => element.name == name)
      .map(element => element.html)
      .at(0)!
  }

  getNames(): string[]{
    return this.textToHtml
      .map(element => element.name)
  }

  getAllElements(): TextToHtml[]{
    const textToHtmlToSurround: TextToHtml[] =
      this.textToHtml.filter(element => element.surround == true);

    const textToHtmlNotSurround: TextToHtml[] =
      this.textToHtml.filter(element => element.surround == false);
      
    const finalTextToHtml = [...textToHtmlToSurround, ...textToHtmlNotSurround]
    return finalTextToHtml
  }
}
