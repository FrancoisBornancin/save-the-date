import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data';
import { GitBody } from '../../model/git-body';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  filePath: string = 'layout.json';
  color!: string;

  constructor(
    private gitManager: GitManagerService
  ) { }

  setColor(color: string){
    this.gitManager.push(this.filePath)
      .subscribe({
        next: (response: any) => {
          const layoutData: LayoutData = this.gitManager.getResponseContent(response);
          layoutData.backgroundColor = color;
          this.gitManager.putData(this.gitManager.getGitBody(this.filePath, JSON.stringify(layoutData), response));
        },
        error: e => {
          console.log(e);
        },
      });
  }
}
