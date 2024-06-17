import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { forkJoin } from 'rxjs';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { StringToHtmlService } from '../../../services/string-to-html/string-to-html.service';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';

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
  imageUrl!: string;
  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  toto: { [key: string]: number } = {};
  fakeText!: string;

  colorRendered: boolean = false;

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService,
    public stringToHtmlService: StringToHtmlService,
    private colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService
  ){

  }

  getImageUrl(){
    return "background-image: url(" + this.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "height: 100%;"
  }

  stringToHtml(){
      return this.stringToHtmlService.replaceString(this.componentFacade.layoutManager.layoutData.imageText);
      // return this.stringToHtmlService.replaceString(this.fakeText);
  }

  ngOnInit(): void {
    // this.fakeText = 'toto';
    this.componentFacade.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.initImplicitDependencies(response);
        this.setElements(1);
      forkJoin(
        this.componentFacade.initTasks(this.imageFolder)
      )
      .subscribe({
        next: (results) => {
          console.log("Toutes les images ont été chargées", results);
          this.imageUrl = this.componentFacade.getImageUrl(1);
        },
        error: (error) => {
          console.error("Erreur lors du chargement des images", error);
        }
      });
        this.dropdownTab = this.componentFacade.getDropdownIndexes();
      },
      error: e => {
        console.log(e);
      },
    });
  }

  increaseData(data: string, value: number){
    if(this.toto[data] == undefined){
      this.toto[data] = 70; 
    }else{
      if(data != 'opacity') this.toto[data] += value;
      else {
        if(this.toto[data] != 100) this.toto[data] += value;
      }
    }
  }

  decreaseData(data: string, value: number){
    if(this.toto[data] == undefined){
      this.toto[data] = 70; 
    }else{
      if(this.toto[data] != 0) this.toto[data] -= value;
    }
  }

  getImageBackgroundStyle(): string{
    this.setLayoutData();

    let realColor: string;
    if(this.imageBackgroundColor == undefined) realColor = 'blue';
    else realColor = this.imageBackgroundColor

    let opacity: number = 0; 
  
    if(this.toto['opacity'] == undefined){
      opacity = 0.2
    }else{
      opacity = ((this.toto['opacity'])/100);
    }

    let backgroundColor = '';
    if(this.colorRendered){
      backgroundColor = 
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.imageBackgroundColor),
        opacity
       ) + ";"
       console.log("");
    } 
    return "height: " + this.toto['height'] + "%;"
         + "width: " + this.toto['width'] + "%;" 
         + "margin: auto;"
         + backgroundColor 
  }

  printColor(){
    this.colorRendered = true;
  }

  doNotPrintColor(){
    this.colorRendered = false;
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
    this.componentFacade.setLayoutData('imageBackgroundColor', this.imageBackgroundColor);
  }
}
