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

  upperImageBackgroundPaddingTop: number = 0;
  upperImageBackgroundHeight: number = 0;
  upperImageBackgroundWidth: number = 0;
  upperImageBackgroundColor: string = '';
  upperImageBackgroundOpacity: number = 0;

  upperImageBorderColor: string = '';
  upperImageBorderRadius: number = 0;
  upperImageBorderSize: number = 0;

  upperImageTextValue: string = '';
  upperImageTextColor: string = 'blue';
  upperImageTextSize: number = 0;
  upperImageTextPolice: string = '';

  belowImageBackgroundPaddingTop: number = 0;
  belowImageBackgroundHeight: number = 0;
  belowImageBackgroundWidth: number = 0;
  belowImageBackgroundColor: string = '';
  belowImageBackgroundOpacity: number = 0;

  belowImageBorderColor: string = '';
  belowImageBorderRadius: number = 0;
  belowImageBorderSize: number = 0;

  belowImageTextValue: string = '';
  belowImageTextColor: string = 'blue';
  belowImageTextSize: number = 0;
  belowImageTextPolice: string = '';

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
    const layoutData = this.getLayoutDataFromView();
    this.setLayoutDataWithoutNotUiKeys(layoutData);
  }

  getLayoutDataFromView(): LayoutData{
    return {
      key: 0,
      upperImage: {
        backgroundData: {
          paddingTop: this.upperImageBackgroundPaddingTop,
          height: this.upperImageBackgroundHeight,
          width: this.upperImageBackgroundWidth,
          color: this.upperImageBackgroundColor,
          opacity: this.upperImageBackgroundOpacity
        },
        borderData: {
          color: this.upperImageBackgroundColor,
          radius: this.upperImageBorderRadius,
          size: this.upperImageBorderSize
        },
        textData: {
          value: this.upperImageTextValue,
          color: this.upperImageTextColor,
          size: this.upperImageTextSize,
          police: this.upperImageTextPolice,
        },
      },
      belowImage: {
        backgroundData: {
          paddingTop: this.belowImageBackgroundPaddingTop,
          height: this.belowImageBackgroundHeight,
          width: this.belowImageBackgroundWidth,
          color: this.belowImageBackgroundColor,
          opacity: this.belowImageBackgroundOpacity
        },
        borderData: {
          color: this.belowImageBackgroundColor,
          radius: this.belowImageBorderRadius,
          size: this.belowImageBorderSize
        },
        textData: {
          value: this.belowImageTextValue,
          color: this.belowImageTextColor,
          size: this.belowImageTextSize,
          police: this.belowImageTextPolice,
        },
      },
      hasBeenSaved: ''
    }
  }

  setLayoutElements(index: number){
    const element = this.getLayoutElements(index);
    this.imageManager.imageUrl = element.imageUrl;

    this.upperImageBackgroundColor = element.layoutData.upperImage.backgroundData.color;
    this.upperImageBackgroundHeight = element.layoutData.upperImage.backgroundData.height;
    this.upperImageBackgroundWidth = element.layoutData.upperImage.backgroundData.width;
    this.upperImageBackgroundOpacity = element.layoutData.upperImage.backgroundData.opacity;
    this.upperImageBackgroundPaddingTop = element.layoutData.upperImage.backgroundData.paddingTop

    this.upperImageBorderColor = element.layoutData.upperImage.borderData.color
    this.upperImageBorderRadius = element.layoutData.upperImage.borderData.radius
    this.upperImageBorderSize = element.layoutData.upperImage.borderData.size

    this.upperImageTextValue = element.layoutData.upperImage.textData.value;
    this.upperImageTextColor = element.layoutData.upperImage.textData.color;
    this.upperImageTextSize = element.layoutData.upperImage.textData.size;
    this.upperImageTextPolice = element.layoutData.upperImage.textData.police;

    this.belowImageBackgroundColor = element.layoutData.belowImage.backgroundData.color;
    this.belowImageBackgroundHeight = element.layoutData.belowImage.backgroundData.height;
    this.belowImageBackgroundWidth = element.layoutData.belowImage.backgroundData.width;
    this.belowImageBackgroundOpacity = element.layoutData.belowImage.backgroundData.opacity;
    this.belowImageBackgroundPaddingTop = element.layoutData.belowImage.backgroundData.paddingTop

    this.belowImageBorderColor = element.layoutData.belowImage.borderData.color
    this.belowImageBorderRadius = element.layoutData.belowImage.borderData.radius
    this.belowImageBorderSize = element.layoutData.belowImage.borderData.size

    this.belowImageTextValue = element.layoutData.belowImage.textData.value;
    this.belowImageTextColor = element.layoutData.belowImage.textData.color;
    this.belowImageTextSize = element.layoutData.belowImage.textData.size;
    this.belowImageTextPolice = element.layoutData.belowImage.textData.police;
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

    this.upperImageBackgroundColor = this.layoutData.upperImage.backgroundData.color;
    this.upperImageBackgroundHeight = this.layoutData.upperImage.backgroundData.height;
    this.upperImageBackgroundWidth = this.layoutData.upperImage.backgroundData.width;
    this.upperImageBackgroundOpacity = this.layoutData.upperImage.backgroundData.opacity;
    this.upperImageBackgroundPaddingTop = this.layoutData.upperImage.backgroundData.paddingTop

    this.upperImageBorderColor = this.layoutData.upperImage.borderData.color
    this.upperImageBorderRadius = this.layoutData.upperImage.borderData.radius
    this.upperImageBorderSize = this.layoutData.upperImage.borderData.size

    this.upperImageTextValue = this.layoutData.upperImage.textData.value;
    this.upperImageTextColor = this.layoutData.upperImage.textData.color;
    this.upperImageTextSize = this.layoutData.upperImage.textData.size;
    this.upperImageTextPolice = this.layoutData.upperImage.textData.police;

    this.belowImageBackgroundColor = this.layoutData.belowImage.backgroundData.color;
    this.belowImageBackgroundHeight = this.layoutData.belowImage.backgroundData.height;
    this.belowImageBackgroundWidth = this.layoutData.belowImage.backgroundData.width;
    this.belowImageBackgroundOpacity = this.layoutData.belowImage.backgroundData.opacity;
    this.belowImageBackgroundPaddingTop = this.layoutData.belowImage.backgroundData.paddingTop

    this.belowImageBorderColor = this.layoutData.belowImage.borderData.color
    this.belowImageBorderRadius = this.layoutData.belowImage.borderData.radius
    this.belowImageBorderSize = this.layoutData.belowImage.borderData.size

    this.belowImageTextValue = this.layoutData.belowImage.textData.value;
    this.belowImageTextColor = this.layoutData.belowImage.textData.color;
    this.belowImageTextSize = this.layoutData.belowImage.textData.size;
    this.belowImageTextPolice = this.layoutData.belowImage.textData.police;
}

  setLayoutDataWithoutNotUiKeys(layoutData: LayoutData){
    this.layoutData.upperImage = layoutData.upperImage
    this.layoutData.belowImage = layoutData.belowImage
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

  saveData(layoutData: LayoutData, index: number){
    const jsonFileName: string = this.inMemoryRepository.layoutJsonName

    this.layoutDataTabFromDb 
      = this.updateLayoutDataTab(this.layoutDataTabFromDb , index, layoutData);
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
