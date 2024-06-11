import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { ImageDataUtilsService } from '../image-data-utils/image-data-utils.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';

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

  getElements(index: number){
      // this.selectedIndex = index;
      this.layoutManager.updateCurrentLayoutData(index);
      this.layoutManager.layoutData.hasBeenSaved = '';
      // this.mainBackgroundColor = this.layoutManager.layoutData.mainBackgroundColor;
      // this.imageBackgroundColor = this.layoutManager.layoutData.imageBackgroundColor;
  
      // this.imageUrl = '';
  
      return {
        imageUrl: '',
        mainBackgroundColor: this.layoutManager.layoutData.mainBackgroundColor,
        imageBackgroundColor: this.layoutManager.layoutData.imageBackgroundColor
      }
  }
}
