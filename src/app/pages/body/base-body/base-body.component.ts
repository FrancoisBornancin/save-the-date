import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { forkJoin } from 'rxjs';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{
  mainBackgroundColor!: string;
  imageBackgroundColor!: string;
  dropdownTab!: number[];
  selectedIndex!: number;
  // imageUrl!: string;
  imageUrl: string = 'assets/test-wedding.jpg';
  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  fakeText!: string;
  replacementString!: string;

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService
  ){

  }

  getImageUrl(){
    return "background-image: url(" + this.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "height: 100%;"
  }

  stringToHtml(){
    const startString = "<p>"
    const endString = "</p>"
    this.fakeText = this.replace(this.fakeText, '|', '<br>');
    this.fakeText = this.replaceAndSurround(this.fakeText, ':it:', '<em>');
    this.fakeText = this.replaceAndSurround(this.fakeText, ':gr:', '<strong>');
    return this.fakeText
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

  reconstructString(startIndex: number, splittedText: string[], openBalise: string, closeBalise: string): string{
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

  ngOnInit(): void {
    this.fakeText = ':gr:toto:gr:titi:it:tutu:it:tata';
    this.stringToHtml();
    console.log("");

    // this.componentFacade.loadData(this.layoutJsonName)
    // .subscribe({
    //   next: (response: any) => {
    //     this.componentFacade.initImplicitDependencies(response);
    //     this.setElements(1);
    //   forkJoin(
    //     this.componentFacade.initTasks(this.imageFolder)
    //   )
    //   .subscribe({
    //     next: (results) => {
    //       console.log("Toutes les images ont été chargées", results);
    //       this.imageUrl = this.componentFacade.getImageUrl(1);
    //     },
    //     error: (error) => {
    //       console.error("Erreur lors du chargement des images", error);
    //     }
    //   });
    //     this.dropdownTab = this.componentFacade.getDropdownIndexes();
    //   },
    //   error: e => {
    //     console.log(e);
    //   },
    // });
  }

  getMainBackgroundStyle(): string{
    this.setLayoutData();

    let realColor: string;
    if(this.mainBackgroundColor == undefined) realColor = 'blue';
    else realColor = this.mainBackgroundColor
    return 'background-color: ' + realColor + '; height: 100%;'
  }

  getImageBackgroundStyle(): string{
    this.setLayoutData();

    let realColor: string;
    if(this.imageBackgroundColor == undefined) realColor = 'blue';
    else realColor = this.imageBackgroundColor
    return 'background-color: ' + realColor + '; height: 50%; width: 50%; margin: auto;'
  }

  loadLayoutDataDropdown(event: any){
    this.selectedIndex = event.value
    this.componentFacade.updateCurrentLayoutDataTab()
    this.setElements(event.value);
    this.imageUrl = this.componentFacade.getImageUrl(event.value);
  }

  upload(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }
    console.log("");

    let file = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.componentFacade.setImageContent(this.imageUrl, this.selectedIndex);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  saveLayout(){
    this.componentFacade.saveLayout(this.selectedIndex, this.layoutJsonName);
  }

  saveImage(){
    this.componentFacade.saveImage(this.imageUrl, this.imageFolder, this.selectedIndex);
  }

  private setElements(index: number){
    const element = this.componentFacade.getElements(index);
    this.imageUrl = element.imageUrl;
    this.imageBackgroundColor = element.imageBackgroundColor;
    this.mainBackgroundColor = element.mainBackgroundColor;
  }

  private setLayoutData(){
    this.componentFacade.setLayoutData('mainBackgroundColor', this.mainBackgroundColor);
    this.componentFacade.setLayoutData('imageBackgroundColor', this.imageBackgroundColor);
  }
}
