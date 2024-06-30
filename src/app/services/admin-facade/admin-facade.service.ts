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
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { LayoutDaoService } from '../layout-dao/layout-dao.service';
import { ImageDaoService } from '../image-dao/image-dao.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFacadeService {
  constructor(
    public layoutManager: LayoutManagerService,
    public gitManager: GitManagerService,
    public imageDataUtils: ImageDataUtilsService,
    public commonFacade: CommonFacadeService,
    public imageDao: ImageDaoService,
    public selectedIndexService: SelectedIndexService
  ) { }

  setLayoutElements(index: number){
    const element = this.getLayoutElements(index);
    this.commonFacade.imageUrl = element.imageUrl;

    this.commonFacade.backgroundColor = element.layoutData.backgroundData.color;
    this.commonFacade.backgroundHeight = element.layoutData.backgroundData.height;
    this.commonFacade.backgroundWidth = element.layoutData.backgroundData.width;
    this.commonFacade.backgroundOpacity = element.layoutData.backgroundData.opacity;
    this.commonFacade.backgroundPaddingTop = element.layoutData.backgroundData.paddingTop

    this.commonFacade.borderColor = element.layoutData.borderData.color
    this.commonFacade.borderRadius = element.layoutData.borderData.radius
    this.commonFacade.borderSize = element.layoutData.borderData.size

    this.commonFacade.textValue = element.layoutData.textData.value;
    this.commonFacade.textColor = element.layoutData.textData.color;
    this.commonFacade.textSize = element.layoutData.textData.size;
    this.commonFacade.textPolice = element.layoutData.textData.police;
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
}
