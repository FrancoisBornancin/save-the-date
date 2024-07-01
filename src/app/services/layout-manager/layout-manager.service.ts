import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data/layout-data';
import { GitBody } from '../../model/git-body';
import { Observable } from 'rxjs';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { CommonFacadeService } from '../common-facade/common-facade.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  layoutData!: LayoutData;
  layoutDataTabFromDb!: LayoutData[];
  layoutDataTabCurrent!: LayoutData[];

  endSaveMessage!: string;

  constructor(
    public gitManager: GitManagerService,
    public selectedIndex: SelectedIndexService,
    public commonFacade: CommonFacadeService
  ) { }

  updateCurrentLayoutData(index: number){
    this.layoutData =
    this.layoutDataTabCurrent
      .filter(layoutData => layoutData.key == index)
      [0]
      ;
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

  updateCurrentLayoutDataTab(){
    this.layoutDataTabCurrent 
      = this.updateLayoutDataTab(this.layoutDataTabCurrent, this.layoutData.key);
  }

  getLayoutElements(index: number){
    this.updateCurrentLayoutData(index);
    this.layoutData.hasBeenSaved = '';

    return {
      imageUrl: '',
      layoutData: this.layoutData,
    }
}

initLayoutDataTabs(response: any){
  this.gitManager.sha = response.sha;
  this.layoutDataTabFromDb = this.gitManager.getStringifyResponseContent(response);
  this.layoutDataTabCurrent = this.gitManager.getStringifyResponseContent(response);
}

  setLayoutDataWithoutNotUiKeys(layoutData: LayoutData){
    this.layoutData.backgroundData = layoutData.backgroundData
    this.layoutData.borderData = layoutData.borderData
    this.layoutData.textData = layoutData.textData;
  }

  updateLayoutDataTab(layoutDataTab: LayoutData[], index: number): LayoutData[]{
    layoutDataTab =
    layoutDataTab
        .filter(element => element.key != index)
        ;

    layoutDataTab.push(this.layoutData);
    return layoutDataTab;
  }

  putData(response: any, jsonFileName: string): Observable<any>{
    this.gitManager.sha = response.sha
    const gitBody: GitBody = this.gitManager.getGitBody(jsonFileName, JSON.stringify(this.layoutDataTabFromDb), this.gitManager.sha.toString())
    return this.gitManager.putData(gitBody);
  }

  saveData(){
    const jsonFileName: string = this.commonFacade.layoutJsonName

    this.layoutDataTabFromDb 
      = this.updateLayoutDataTab(this.layoutDataTabFromDb , this.selectedIndex.index);
    this.loadData(jsonFileName)
    .subscribe({
      next: (response: any) => {
        this.layoutData.hasBeenSaved = 'Data are saving...'
        this.putData(response, jsonFileName)
        .subscribe({
          next: e => {
            this.layoutData.hasBeenSaved = 'LayoutSave has succeed';
          },
          error: e => {
            this.layoutData.hasBeenSaved = 'LayoutSave has failed';
          },
        });
      },
      error: response => {
        this.layoutData.hasBeenSaved = 'Retrieve data has failed';
      },
    });
  }

  loadData(jsonFileName: string): Observable<any>{
    return this.gitManager.get(jsonFileName)
  }
}
