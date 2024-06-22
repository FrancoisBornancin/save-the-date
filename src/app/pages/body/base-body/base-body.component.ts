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
  saveLoadButtons!: MenuItem[];


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

  dropdownTab!: number[];
  selectedIndex!: number;
  imageUrl!: string;

  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public textToHtmlRetriever: TextToHtmlRetrieverService
  ){
    this.uiButtons = [
      ...this.initButton('InsideBackground', this.insideBackgroundDataRenderedContainer, 'ui'),
      ...this.initButton('Border', this.borderDataRenderedContainer, 'ui'),
      ...this.initButton('Text', this.textDataRenderedContainer, 'ui'),
    ];

    this.initSaveLoadButtons()

  }

  doActionForLayout(index: number){
    this.loadLayoutDataDropdown(index);

    const loadButtonToNotPrintStrong: MenuItem[] =
      this.saveLoadButtons
        .filter(element => element.label != undefined)
        .filter(element => element.label?.includes("<strong>"))

    loadButtonToNotPrintStrong
      .forEach(element => {
        element.label = element.label?.split("<strong>").at(1);
        element.label = element.label?.split("</strong>").at(0);
      })

    const loadButtonToPrintStrong: MenuItem =
      this.saveLoadButtons
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
                this.saveLoadButtons.filter(element => element.label?.includes(buttonName)).at(0)!
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
                this.saveLoadButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = buttonName
            } 
          } 
        }
      },
      { separator: true },
    ]    
  }

  initSaveLoadButtons(){
    this.saveLoadButtons = [
      {
        label: 'save current Image',
        command: () => {
          this.saveImage();
        }
      },
      { separator: true },
      {
        label: 'save current Layout',
        command: () => {
          this.saveLayout();
        }
      },
      { separator: true },
      ...this.initButton('Upload Image', this.uploadImageDataRenderedContainer, 'upload'),
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
      this.saveLoadButtons.push(
        {
          label: ('load layout' + element),
          command: () => {
            this.doActionForLayout(element)
          }
        }
      )
      this.saveLoadButtons.push(
        { separator: true }
      )
    })
  }

  ngOnInit(): void {
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

  saveLayout(){
    this.componentFacade.saveLayout(this.selectedIndex, this.layoutJsonName);
  }

  saveImage(){
    this.componentFacade.saveImage(this.imageUrl, this.imageFolder, this.selectedIndex);
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

  private setLayoutData(){
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
