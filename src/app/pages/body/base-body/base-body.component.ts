import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { LayoutData } from '../../../model/layout-data/layout-data';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { TextToHtmlRetrieverService } from '../../../services/text-to-html-retriever/text-to-html-retriever.service';
import { fontFamily } from '../../font-family';
import { MenuItem } from 'primeng/api/menuitem';
import { DataRenderedContainer } from '../../../model/data-rendered-container';
import { DatabaseManagerService } from '../../../services/database-manager/database-manager.service';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{

  insideBackgroundDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  borderDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  textDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  uploadImageDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  generalInfoModalRendered: boolean = false;

  uiButtons!: MenuItem[];
  saveUploadButtons!: MenuItem[];
  loadButtons!: MenuItem[];

  backgroundColor!: string;
  backgroundPaddingTop!: number;
  backgroundHeight!: number;
  backgroundWidth!: number;
  backgroundOpacity!: number;

  borderRadius!: number;
  borderSize!: number;
  borderColor!: string;

  textValue!: string;
  textColor!: string;
  textSize!: number;
  textPolice!: string;

  policeTab!: string[];

  selectedIndex!: number;
  imageUrl!: string;

  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public databaseManager: DatabaseManagerService
  ){
    this.initLoadButtons();
  } 

  ngOnInit(): void {
    if(this.adminManager.isAdminModeActive){
      this.initForAdmin();
    }else{
      this.initForUser();
    }
  }

  initForUser(){
    this.componentFacade.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.getLayoutForUser(response);
        this.setLayoutElementsForUser();
      },
      error: e => {
        console.log(e);
      },
    });
    this.componentFacade.imageDataUtils
    .loadImageForUser(this.imageFolder)
    .subscribe({
      next: (response: any) => {
        this.imageUrl = response;
      },
      error: e => {
        console.log(e);
      },
    });
  }

  initForAdmin(){
    this.policeTab = this.initPoliceTab();

    this.componentFacade.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.initImplicitDependencies(response);
        this.setLayoutElements(1);
        this.wrapForkJoin()
        .subscribe({
          next: (results) => {
            console.log("Toutes les images ont été chargées", results);
            this.imageUrl = this.componentFacade.getImageUrl(1);

            this.selectedIndex = 1;

            this.uiButtons = [
              ...this.initButton('InsideBackground', this.insideBackgroundDataRenderedContainer, 'ui'),
              ...this.initButton('Border', this.borderDataRenderedContainer, 'ui'),
              ...this.initButton('Text', this.textDataRenderedContainer, 'ui'),
            ];
        
            this.initSaveUploadButtons()
          },
          error: (error) => {
            console.error("Erreur lors du chargement des images", error);
          }
        });
      },
      error: e => {
        console.log(e);
      },
    });
  }

  setLayoutElementsForUser(){
    const layoutData = this.componentFacade.layoutManager.layoutData;

    this.backgroundColor = layoutData.backgroundData.color;
    this.backgroundHeight = layoutData.backgroundData.height;
    this.backgroundWidth = layoutData.backgroundData.width;
    this.backgroundOpacity = layoutData.backgroundData.opacity;
    this.backgroundPaddingTop = layoutData.backgroundData.paddingTop

    this.borderColor = layoutData.borderData.color
    this.borderRadius = layoutData.borderData.radius
    this.borderSize = layoutData.borderData.size

    this.textValue = layoutData.textData.value;
    this.textColor = layoutData.textData.color;
    this.textSize = layoutData.textData.size;
    this.textPolice = layoutData.textData.police;
  }

  setLayoutElements(index: number){
    const element = this.componentFacade.getLayoutElements(index);
    this.imageUrl = element.imageUrl;

    this.backgroundColor = element.layoutData.backgroundData.color;
    this.backgroundHeight = element.layoutData.backgroundData.height;
    this.backgroundWidth = element.layoutData.backgroundData.width;
    this.backgroundOpacity = element.layoutData.backgroundData.opacity;
    this.backgroundPaddingTop = element.layoutData.backgroundData.paddingTop

    this.borderColor = element.layoutData.borderData.color
    this.borderRadius = element.layoutData.borderData.radius
    this.borderSize = element.layoutData.borderData.size

    this.textValue = element.layoutData.textData.value;
    this.textColor = element.layoutData.textData.color;
    this.textSize = element.layoutData.textData.size;
    this.textPolice = element.layoutData.textData.police;
  }

  doActionForLayout(index: number){
    this.loadLayoutDataDropdown(index);

    const loadButtonToNotPrintStrong: MenuItem[] =
      this.loadButtons
        .filter(element => element.label != undefined)
        .filter(element => element.label?.includes("<strong>"))

    loadButtonToNotPrintStrong
      .forEach(element => {
        element.label = element.label?.split("<strong>").at(1);
        element.label = element.label?.split("</strong>").at(0);
      })

    const loadButtonToPrintStrong: MenuItem =
      this.loadButtons
        .filter(element => element.label != undefined)
        .filter(element => element.label?.includes("" + index))
        .at(0)!

    loadButtonToPrintStrong.label = '<strong>' + loadButtonToPrintStrong.label + '<strong>' 
  }

  initButton(buttonName: string, dataRenderedContainer: DataRenderedContainer, menuOptionCategory: string){
    return [
      {
        label: buttonName,
        command: () => {
          if(!dataRenderedContainer.dataRendered) {
            dataRenderedContainer.dataRendered = true;

            if(menuOptionCategory == 'ui'){
              const uiButton: MenuItem =
                this.uiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = '<strong>' + buttonName + '</strong>'
            } 

            if(menuOptionCategory == 'upload'){
              const uploadButton: MenuItem =
                this.saveUploadButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = '<strong>' + buttonName + '</strong>'
            } 

          }
          else{
            dataRenderedContainer.dataRendered = false;

            if(menuOptionCategory == 'ui'){
              const uiButton: MenuItem =
                this.uiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = buttonName
            } 

            if(menuOptionCategory == 'upload'){
              const uploadButton: MenuItem =
                this.saveUploadButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = buttonName
            } 
          } 
        }
      },
      { separator: true },
    ]    
  }

  initLoadButtons(){
    this.loadButtons = [
      {
        label: '<strong>load layout1</strong>',
        command: () => {
          this.doActionForLayout(1);
        }
      },
      { separator: true }
    ]

    const indexes: number[] = [2, 3, 4, 5];

    indexes
    .forEach(element => {
      this.loadButtons.push(
        {
          label: ('load layout' + element),
          command: () => {
            this.doActionForLayout(element)
          }
        }
      )
      this.loadButtons.push(
        { separator: true }
      )
    })
  }

  initSaveUploadButtons(){
    this.setLayoutData()
    this.saveUploadButtons = [
      ...this.initSaveImage(),
      ...this.initSaveLayout(),
      ...this.initButton('Upload Image', this.uploadImageDataRenderedContainer, 'upload'),
    ]
  }

  initPoliceTab(): string[]{
    return fontFamily
            .split("?")[1]
            .split("&")
            .filter(element => element != 'display=swap')
            .map(element => {
              let policeName =
                element
                  .split("Playwrite+")[1]
                  .split(":")[0]

              policeName =
                policeName.includes("+") ? policeName.split("+").join(" ") : policeName
              return policeName
            })
  }

  initSaveLayout(): MenuItem[]{
    if(!this.isLayoutDataSaved()){
      return [
        { separator: true },
        {
          label: 'save current Layout',
          command: () => {
            this.saveLayout();
          }
        },
        { separator: true },
      ]
    }else return [{ separator: true },]
  }

  initSaveImage(): MenuItem[]{
    if(!this.isImageDataSaved()){
      return [
        {
          label: 'save current Image',
          command: () => {
            this.saveImage();
          }
        },
      ]
    }else return []
  }

  getImageUrl(){
    return "background-image: url(" + this.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "padding-top: " + this.backgroundPaddingTop + "%;"
         + "height: 100%;"
  }

  wrapForkJoin(): Observable<any[]>{
    return forkJoin(
      this.componentFacade.initTasks(this.imageFolder)
    )
  }

  textStyle(){
    return 'color: ' + this.textColor + ";"
          + 'font-size: ' + this.textSize + "px;"
          + 'font-family: "Playwrite ' + this.textPolice + '", cursive;'
  }

  getImageBackgroundStyle(): string{
      const backgroundColor =
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.backgroundColor),
        (this.backgroundOpacity/100)
       ) + ";"
    return "height: " + this.backgroundHeight + "%;"
         + "width: " + this.backgroundWidth + "%;"
         + "border-radius: " + this.borderRadius + "%;"
         + "border: " + this.borderSize + "px solid " + this.borderColor + ";"
         + "margin: auto;"
         + backgroundColor
  }

  printGeneralInfoModal(){
    if(this.generalInfoModalRendered){
      this.generalInfoModalRendered = false;
    }else{
      this.generalInfoModalRendered = true;
    }
  }

  loadLayoutDataDropdown(index: number){
    this.setLayoutData();
    this.selectedIndex = index
    this.componentFacade.updateCurrentLayoutDataTab()
    this.setLayoutElements(index);
    this.imageUrl = this.componentFacade.getImageUrl(index);
  }

  upload(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

    let file = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.componentFacade.setImageContent(this.imageUrl, this.selectedIndex);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  private isLayoutDataSaved(): boolean{
    const layoutData: LayoutData =
      this.componentFacade.layoutManager.layoutData;

    return this.databaseManager.isLayoutInDb(layoutData);  
  }

  private isImageDataSaved(): boolean{
    return this.databaseManager.isImageInDb(this.selectedIndex);  
  }

  saveLayout(){
    this.setLayoutData();
    this.componentFacade.saveLayout(this.selectedIndex, this.layoutJsonName);
  }

  saveImage(){
    this.componentFacade.saveImage(this.imageUrl, this.imageFolder, this.selectedIndex);
  }

  setLayoutData(){
    const layoutData: LayoutData = {
      key: 0,
      backgroundData: {
        paddingTop: this.backgroundPaddingTop,
        height: this.backgroundHeight,
        width: this.backgroundWidth,
        color: this.backgroundColor,
        opacity: this.backgroundOpacity
      },
      borderData: {
        color: this.borderColor,
        radius: this.borderRadius,
        size: this.borderSize
      },
      textData: {
        value: this.textValue,
        color: this.textColor,
        size: this.textSize,
        police: this.textPolice,
      },
      hasBeenSaved: ''
    }
    this.componentFacade.setLayoutDataWithoutNotUiKeys(layoutData);
  }
}
