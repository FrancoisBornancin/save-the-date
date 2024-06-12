import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { ImageDataUtilsService } from '../image-data-utils/image-data-utils.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { CustomImageData } from '../../model/image-data';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ComponentFacadeService {

  constructor(
    public layoutManager: LayoutManagerService,
    private gitManager: GitManagerService,
    public imageDataUtils: ImageDataUtilsService,
  ) { }

  initImplicitDependencies(response: any){
    this.gitManager.sha = response.sha;
    this.layoutManager.layoutDataTabFromDb = this.gitManager.getStringifyResponseContent(response);
    this.layoutManager.layoutDataTabCurrent = this.gitManager.getStringifyResponseContent(response);
  }

  loadData(jsonFileName: string): Observable<any>{
    return this.layoutManager.loadData(jsonFileName);
  }

  updateCurrentLayoutDataTab(){
    this.layoutManager.updateCurrentLayoutDataTab()
  }

  setLayoutData(thisKey: string, thisValue: string){
    Object.assign(this.layoutManager.layoutData, {thisKey: thisValue});
  }

  saveImage(imageUrl: string, imageFolder: string, index: number){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(imageUrl);
    this.imageDataUtils.saveImageData(index, imageData, imageFolder);
  }

  setImageContent(imageUrl: string, index: number){
    this.imageDataUtils.setImageContent(imageUrl, index);
  }

  getElements(index: number){
      this.layoutManager.updateCurrentLayoutData(index);
      this.layoutManager.layoutData.hasBeenSaved = '';

      return {
        imageUrl: '',
        mainBackgroundColor: this.layoutManager.layoutData.mainBackgroundColor,
        imageBackgroundColor: this.layoutManager.layoutData.imageBackgroundColor
      }
  }

  initTasks(imageFolder: string){
    this.imageDataUtils.bigImageTab =
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
