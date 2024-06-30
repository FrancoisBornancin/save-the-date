import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DataRenderedContainer } from '../../model/data-rendered-container';
import { AdminFacadeService } from '../admin-facade/admin-facade.service';

@Injectable({
  providedIn: 'root'
})
export class ButtonManagerService {
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

  uiButtons!: MenuItem[];
  saveUploadButtons!: MenuItem[];
  loadButtons!: MenuItem[];

  constructor(
    public adminFacade: AdminFacadeService
  ) { }

  initUiButtons(){
    const menuOptionCategory: string  = 'ui';

    this.uiButtons = [
      ...this.initButton('InsideBackground', this.insideBackgroundDataRenderedContainer, menuOptionCategory),
      ...this.initButton('Border', this.borderDataRenderedContainer, menuOptionCategory),
      ...this.initButton('Text', this.textDataRenderedContainer, menuOptionCategory),
    ]
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

  doActionForLayout(index: number){
    this.adminFacade.loadLayoutDataDropdown(index);

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
    this.adminFacade.setLayoutData()
    this.saveUploadButtons = [
      ...this.initSaveImage(),
      ...this.initSaveLayout(),
      ...this.initButton('Upload Image', this.uploadImageDataRenderedContainer, 'upload'),
    ]
  }

  initSaveImage(): MenuItem[]{
    if(!this.adminFacade.isImageDataSaved()){
      return [
        {
          label: 'save current Image',
          command: () => {
            this.adminFacade.saveImage();
          }
        },
      ]
    }else return []
  }

  initSaveLayout(): MenuItem[]{
    if(!this.adminFacade.isLayoutDataSaved()){
      return [
        { separator: true },
        {
          label: 'save current Layout',
          command: () => {
            this.adminFacade.saveLayout();
          }
        },
        { separator: true },
      ]
    }else return [{ separator: true },]
  }
}
