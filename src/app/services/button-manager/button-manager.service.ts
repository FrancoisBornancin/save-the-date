import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DataRenderedContainer } from '../../model/data-rendered-container';
import { ImageDaoService } from '../image-dao/image-dao.service';
import { LayoutDaoService } from '../layout-dao/layout-dao.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonManagerService {
  upperImageInsideBackgroundDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  upperImageBorderDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  upperImageTextDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  belowImageInsideBackgroundDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  belowImageBorderDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  belowImageTextDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  uploadUpperImageDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  uploadBelowImageDataRenderedContainer: DataRenderedContainer = {
    dataRendered: false
  }

  upperImageUiButtons!: MenuItem[];
  belowImageUiButtons!: MenuItem[];
  saveUploadUpperButtons!: MenuItem[];
  saveUploadBelowButtons!: MenuItem[];
  loadButtons!: MenuItem[];

  constructor(
    public imageDao: ImageDaoService,
    public layoutDao: LayoutDaoService,
    public layoutManager: LayoutManagerService
  ) { }

  initUiButtons(){
    const upperUi: string  = 'upper ui';
    const belowUi: string  = 'below ui';

    this.upperImageUiButtons = [
      ...this.initButton('Inside Bordure', this.upperImageInsideBackgroundDataRenderedContainer, upperUi),
      ...this.initButton('Border', this.upperImageBorderDataRenderedContainer, upperUi),
      ...this.initButton('Text', this.upperImageTextDataRenderedContainer, upperUi),
    ]

    this.belowImageUiButtons = [
      ...this.initButton('Inside Bordure', this.belowImageInsideBackgroundDataRenderedContainer, belowUi),
      ...this.initButton('Border', this.belowImageBorderDataRenderedContainer, belowUi),
      ...this.initButton('Text', this.belowImageTextDataRenderedContainer, belowUi),
    ]
  }

  initButton(buttonName: string, dataRenderedContainer: DataRenderedContainer, menuOptionCategory: string){
    return [
      {
        label: buttonName,
        command: () => {
          if(!dataRenderedContainer.dataRendered) {
            dataRenderedContainer.dataRendered = true;

            if(menuOptionCategory == 'upper ui'){
              const uiButton: MenuItem =
                this.upperImageUiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = '<strong>' + buttonName + '</strong>'
            }

            if(menuOptionCategory == 'below ui'){
              const uiButton: MenuItem =
                this.belowImageUiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = '<strong>' + buttonName + '</strong>'
            }

            if(menuOptionCategory == 'upload upper'){
              const uploadButton: MenuItem =
                this.saveUploadUpperButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = '<strong>' + buttonName + '</strong>'
            }

            if(menuOptionCategory == 'upload below'){
              const uploadButton: MenuItem =
                this.saveUploadBelowButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = '<strong>' + buttonName + '</strong>'
            }
          }
          else{
            dataRenderedContainer.dataRendered = false;

            if(menuOptionCategory == 'upper ui'){
              const uiButton: MenuItem =
                this.upperImageUiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = buttonName
            }

            if(menuOptionCategory == 'below ui'){
              const uiButton: MenuItem =
                this.belowImageUiButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uiButton.label = buttonName
            }

            if(menuOptionCategory == 'upload'){
              const uploadButton: MenuItem =
                this.saveUploadUpperButtons.filter(element => element.label?.includes(buttonName)).at(0)!
              uploadButton.label = buttonName
            }
          }
        }
      },
      { separator: true },
    ]
  }

  doActionForLayout(index: number){
    this.layoutDao.loadLayoutDataDropdown(index);

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

  initSaveUploadUpperButtons(){
    this.layoutManager.setLayoutData()
    this.saveUploadUpperButtons = [
      ...this.initPrintImageToUser('upper'),
      ...this.initPrintLayoutToUser(),
      ...this.initSaveImage('upper'),
      ...this.initSaveLayout(),
      ...this.initButton('Upload Image', this.uploadUpperImageDataRenderedContainer, 'upload upper'),
    ]
  }

  initSaveUploadBelowButtons(){
    this.saveUploadBelowButtons = [
      ...this.initPrintImageToUser('below'),
      ...this.initSaveImage('below'),
      ...this.initButton('Upload Image', this.uploadBelowImageDataRenderedContainer, 'upload below'),
    ]
  }

  initPrintLayoutToUser(): MenuItem[]{
    if(this.layoutDao.isLayoutPrintedToUser()){
      return []
    }
    else {
      return [
        { separator: true },
        {
          label: 'print layout to User',
          command: () => {
            this.layoutDao.saveLayoutToUser();
          }
        },
      ]
    }
  }

  initPrintImageToUser(prefix: string): MenuItem[]{
    if(this.imageDao.isImagePrintedToUser(prefix)){
      return []
    }
    else {
      return [
        {
          label: 'print image to User',
          command: () => {
            // this.imageDao.saveImageToUser(prefix);
          }
        },
      ]
    }
  }

  initSaveImage(prefix: string): MenuItem[]{
    if(!this.imageDao.isImageInDb(prefix)){
      return [
        {
          label: 'save Image',
          command: () => {
            // this.imageDao.saveImage(prefix);
          }
        },
      ]
    }else return []
  }

  initSaveLayout(): MenuItem[]{
    if(!this.layoutDao.isLayoutInDb()){
      return [
        { separator: true },
        {
          label: 'save current Layout',
          command: () => {
            this.layoutDao.saveLayout();
          }
        },
        { separator: true },
      ]
    }else return [{ separator: true },]
  }
}
