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
  layoutDataTab!: LayoutData[];

  constructor(
    private gitManager: GitManagerService
  ) { }

  setColor(color: string): void{
    this.layoutData.backgroundColor = color;
  }

  saveData(){
    this.gitManager.putData(
      this.gitManager.getGitBody(
        this.filePath, 
        JSON.stringify(this.layoutData), 
        this.gitManager.sha.toString()
      )
    );
  }

  loadData(): Observable<any>{
    return this.gitManager.get(this.filePath)
  }
}
