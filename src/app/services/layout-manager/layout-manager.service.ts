import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data';
import { GitBody } from '../../model/git-body';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  filePath: string = 'layout.json';
  color: string = 'blue';
  layoutData!: LayoutData;
  layoutDataTabFromDb!: LayoutData[];
  layoutDataTabCurrent!: LayoutData[];

  constructor(
    private gitManager: GitManagerService
  ) { }

  setColor(color: string): void{
    this.layoutData.backgroundColor = color;
  }

  saveData(index: number){
    this.updateLayoutTab(index);
    this.gitManager.putData(
      this.gitManager.getGitBody(
        this.filePath, 
        JSON.stringify(this.layoutDataTabFromDb), 
        this.gitManager.sha.toString()
      )
    );
  }

  updateLayoutTab(index: number){
    this.layoutDataTabFromDb = 
      this.layoutDataTabFromDb  
        .filter(element => element.key != index)
        ;

    this.layoutDataTabFromDb.push(this.layoutData);
    console.log("");
  }


  loadData(): Observable<any>{
    return this.gitManager.get(this.filePath)
  }
}
