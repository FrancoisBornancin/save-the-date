import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data';
import { GitBody } from '../../model/git-body';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  layoutData!: LayoutData;
  layoutDataTabFromDb!: LayoutData[];
  layoutDataTabCurrent!: LayoutData[];

  endSaveMessage!: string;

  constructor(
    private gitManager: GitManagerService
  ) { }

  updateCurrentLayoutData(index: number){
    this.layoutData =
    this.layoutDataTabCurrent
      .filter(layoutData => layoutData.key == index)
      [0]
      ;
  }

  updateCurrentLayoutDataTab(){
    this.layoutDataTabCurrent =
      this.layoutDataTabCurrent
        .filter(element => element.key != this.layoutData.key)
        ;

    this.layoutDataTabCurrent.push(this.layoutData);
  }

  putData(response: any, jsonFileName: string): Observable<any>{
    this.gitManager.sha = response.sha
    const gitBody: GitBody = this.gitManager.getGitBody(jsonFileName, JSON.stringify(this.layoutDataTabFromDb), this.gitManager.sha.toString())
    return this.gitManager.putData(gitBody);
  }

  saveData(index: number, jsonFileName: string){
    this.updateLayoutTab(index);
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

  updateLayoutTab(index: number){
    this.layoutDataTabFromDb = 
      this.layoutDataTabFromDb  
        .filter(element => element.key != index)
        ;

    this.layoutDataTabFromDb.push(this.layoutData);
  }


  loadData(jsonFileName: string): Observable<any>{
    return this.gitManager.get(jsonFileName)
  }
}
