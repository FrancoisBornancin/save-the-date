import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { DataRenderedContainer } from '../../../model/data-rendered-container';
import { LayoutData } from '../../../model/layout-data/layout-data';
import { AdminFacadeService } from '../../../services/admin-facade/admin-facade.service';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { CommonFacadeService } from '../../../services/common-facade/common-facade.service';
import { DatabaseManagerService } from '../../../services/database-manager/database-manager.service';
import { UserFacadeService } from '../../../services/user-facade/user-facade.service';
import { fontFamily } from '../../font-family';

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

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public adminFacade: AdminFacadeService,
    public userFacade: UserFacadeService,
    public commonFacade: CommonFacadeService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public databaseManager: DatabaseManagerService,
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
    this.commonFacade.loadData(this.commonFacade.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.userFacade.getLayout(response);
        this.setLayoutElementsForUser();
      },
      error: e => {
        console.log(e);
      },
    });
    this.adminFacade.imageDataUtils
    .loadImageForUser(this.commonFacade.imageFolder)
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

    this.commonFacade.loadData(this.commonFacade.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.adminFacade.initImplicitDependencies(response);
        this.setLayoutElements(1);
        this.wrapForkJoin()
        .subscribe({
          next: (results) => {
            console.log("Toutes les images ont été chargées", results);
            this.imageUrl = this.adminFacade.getImageUrl(1);

            this.selectedIndex = 1;

            this.uiButtons = this.adminFacade.initUiButtons(
              this.insideBackgroundDataRenderedContainer,
              this.borderDataRenderedContainer,
              this.textDataRenderedContainer
            );

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
    const layoutData = this.adminFacade.layoutManager.layoutData;

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
    const element = this.adminFacade.getLayoutElements(index);
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
      ...this.adminFacade.initButton('Upload Image', this.uploadImageDataRenderedContainer, 'upload'),
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
      this.adminFacade.initTasks(this.commonFacade.imageFolder)
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
    this.adminFacade.updateCurrentLayoutDataTab()
    this.setLayoutElements(index);
    this.imageUrl = this.adminFacade.getImageUrl(index);
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
      this.adminFacade.setImageContent(this.imageUrl, this.selectedIndex);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  private isLayoutDataSaved(): boolean{
    const layoutData: LayoutData =
      this.adminFacade.layoutManager.layoutData;

    return this.databaseManager.isLayoutInDb(layoutData);
  }

  private isImageDataSaved(): boolean{
    return this.databaseManager.isImageInDb(this.selectedIndex);
  }

  saveLayout(){
    this.adminFacade.setLayoutData();
    this.adminFacade.saveLayout(this.selectedIndex, this.commonFacade.layoutJsonName);
  }

  saveImage(){
    this.adminFacade.saveImage(this.imageUrl, this.commonFacade.imageFolder, this.selectedIndex);
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
    this.adminFacade.setLayoutDataWithoutNotUiKeys(layoutData);
  }
}
