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
