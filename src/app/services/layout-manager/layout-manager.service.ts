import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data/layout-data';
import { GitBody } from '../../model/git-body';
import { Observable } from 'rxjs';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';
import { ImageManagerService } from '../image-manager/image-manager.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  layoutData!: LayoutData;
  layoutDataTabFromDb!: LayoutData[];
  layoutDataTabCurrent!: LayoutData[];

  endSaveMessage!: string;

  backgroundPaddingTop: number = 0;
  backgroundHeight: number = 0;
  backgroundWidth: number = 0;
  backgroundColor: string = '';
  backgroundOpacity: number = 0;

  borderColor: string = '';
  borderRadius: number = 0;
  borderSize: number = 0;

  textValue: string = '';
  textColor: string = '';
  textSize: number = 0;
  textPolice: string = '';

  constructor(
    public gitManager: GitManagerService,
    public selectedIndex: SelectedIndexService,
    public imageManager: ImageManagerService,
    public inMemoryRepository: InMemoryRepositoryService
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
        paddingTop: this.backgroundPaddingTop,
        height: this.backgroundHeight,
        width: this.backgroundWidth,
        color: this.backgroundColor,
        opacity: this.backgroundOpacity
      },
      borderData: {
        color: this.backgroundColor,
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
    this.setLayoutDataWithoutNotUiKeys(layoutData);
  }

  setLayoutElements(index: number){
    const element = this.getLayoutElements(index);
    this.imageManager.imageUrl = element.imageUrl;

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

  updateCurrentLayoutDataTab(){
    this.layoutDataTabCurrent 
      = this.updateLayoutDataTab(this.layoutDataTabCurrent, this.layoutData.key, this.layoutData);
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

setLayoutForUser(response: any){
  const userIndex: number = 0;

  this.layoutData
    = this.gitManager.getStringifyResponseContent(response)
      .filter((element: { key: number; }) => element.key == userIndex)
      .at(0)!

    this.backgroundColor = this.layoutData.backgroundData.color;
    this.backgroundHeight = this.layoutData.backgroundData.height;
    this.backgroundWidth = this.layoutData.backgroundData.width;
    this.backgroundOpacity = this.layoutData.backgroundData.opacity;
    this.backgroundPaddingTop = this.layoutData.backgroundData.paddingTop

    this.borderColor = this.layoutData.borderData.color
    this.borderRadius = this.layoutData.borderData.radius
    this.borderSize = this.layoutData.borderData.size

    this.textValue = this.layoutData.textData.value;
    this.textColor = this.layoutData.textData.color;
    this.textSize = this.layoutData.textData.size;
    this.textPolice = this.layoutData.textData.police;
}

  setLayoutDataWithoutNotUiKeys(layoutData: LayoutData){
    this.layoutData.backgroundData = layoutData.backgroundData
    this.layoutData.borderData = layoutData.borderData
    this.layoutData.textData = layoutData.textData;
  }

  updateLayoutDataTab(layoutDataTab: LayoutData[], index: number, layoutData: LayoutData): LayoutData[]{
    layoutDataTab =
    layoutDataTab
        .filter(element => element.key != index)
        ;

    layoutDataTab.push(layoutData);
    return layoutDataTab;
  }

  putData(response: any, jsonFileName: string): Observable<any>{
    this.gitManager.sha = response.sha
    const gitBody: GitBody = this.gitManager.getGitBody(jsonFileName, JSON.stringify(this.layoutDataTabFromDb), this.gitManager.sha.toString())
    return this.gitManager.putData(gitBody);
  }

  saveData(layoutData: LayoutData){
    const jsonFileName: string = this.inMemoryRepository.layoutJsonName

    this.layoutDataTabFromDb 
      = this.updateLayoutDataTab(this.layoutDataTabFromDb , this.selectedIndex.index, layoutData);
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
