import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { ImageDataUtilsService } from '../image-data-utils/image-data-utils.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { CustomImageData } from '../../model/image-data';
import { Observable } from 'rxjs/internal/Observable';
import { LayoutData } from '../../model/layout-data/layout-data';
import { MenuItem } from 'primeng/api';
import { DataRenderedContainer } from '../../model/data-rendered-container';
import { NumberContainer } from '../../model/number-container';
import { StringContainer } from '../../model/string-container';
import { CommonFacadeService } from '../common-facade/common-facade.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFacadeService {
  uiButtons!: MenuItem[];
  saveUploadButtons!: MenuItem[];
  loadButtons!: MenuItem[];

  constructor(
    public layoutManager: LayoutManagerService,
    public gitManager: GitManagerService,
    public imageDataUtils: ImageDataUtilsService,
    public commonFacade: CommonFacadeService,
  ) { }

  initUiButtons(insideBackgroundDataRenderedContainer: DataRenderedContainer, borderDataRenderedContainer: DataRenderedContainer, textDataRenderedContainer: DataRenderedContainer): MenuItem[]{
    const menuOptionCategory: string  = 'ui';

    this.uiButtons = [
      ...this.initButton('InsideBackground', insideBackgroundDataRenderedContainer, menuOptionCategory),
      ...this.initButton('Border', borderDataRenderedContainer, menuOptionCategory),
      ...this.initButton('Text', textDataRenderedContainer, menuOptionCategory),
    ]

    return this.uiButtons;
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

  setLayoutData(){
    const layoutData: LayoutData = {
      key: 0,
      backgroundData: {
        paddingTop: this.commonFacade.backgroundPaddingTop,
        height: this.commonFacade.backgroundHeight,
        width: this.commonFacade.backgroundWidth,
        color: this.commonFacade.backgroundColor,
        opacity: this.commonFacade.backgroundOpacity
      },
      borderData: {
        color: this.commonFacade.backgroundColor,
        radius: this.commonFacade.borderRadius,
        size: this.commonFacade.borderSize
      },
      textData: {
        value: this.commonFacade.textValue,
        color: this.commonFacade.textColor,
        size: this.commonFacade.textSize,
        police: this.commonFacade.textPolice,
      },
      hasBeenSaved: ''
    }
    this.setLayoutDataWithoutNotUiKeys(layoutData);
  }

  initImplicitDependencies(response: any){
    this.gitManager.sha = response.sha;
    this.layoutManager.layoutDataTabFromDb = this.gitManager.getStringifyResponseContent(response);
    this.layoutManager.layoutDataTabCurrent = this.gitManager.getStringifyResponseContent(response);
  }

  updateCurrentLayoutDataTab(){
    this.layoutManager.layoutDataTabCurrent 
      = this.layoutManager.updateLayoutDataTab(this.layoutManager.layoutDataTabCurrent, this.layoutManager.layoutData.key);
  }

  setLayoutDataWithoutNotUiKeys(layoutData: LayoutData){
    this.layoutManager.layoutData.backgroundData = layoutData.backgroundData
    this.layoutManager.layoutData.borderData = layoutData.borderData
    this.layoutManager.layoutData.textData = layoutData.textData;
  }

  saveImage(imageUrl: string, imageFolder: string, index: number){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(imageUrl);
    this.imageDataUtils.saveImageData(index, imageData, imageFolder);
  }

  setImageContent(imageUrl: string, index: number){
    this.imageDataUtils.setImageContent(imageUrl, index);
  }

  getLayoutElements(index: number){
      this.layoutManager.updateCurrentLayoutData(index);
      this.layoutManager.layoutData.hasBeenSaved = '';

      return {
        imageUrl: '',
        layoutData: this.layoutManager.layoutData,
      }
  }

  initTasks(imageFolder: string){
    this.imageDataUtils.bigImageTab =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    this.imageDataUtils.bigImageTabFromDb =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    return this.imageDataUtils.bigImageTab.map(element => this.imageDataUtils.fillBigImageTab(element.key, imageFolder));
  }

  getImageUrl(index: number){
    return this.imageDataUtils.loadIndexedImageUrl(index);
  }

  getDropdownIndexes(){
    const numberTab: number[] =
     this.layoutManager.layoutDataTabFromDb
      .map(element => element.key)
      .sort((a, b) => (a - b))
      ;

    return [...new Set(numberTab)];
  }

  saveLayout(selectedIndex: number, layoutJsonName: string){
    this.layoutManager.saveData(selectedIndex, layoutJsonName);
  }
}
