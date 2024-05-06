import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { LayoutData } from '../../model/layout-data';
import { GitBody } from '../../model/git-body';

@Injectable({
  providedIn: 'root'
})
export class LayoutManagerService {
  filePath: string = 'layout.json';
  color: string = 'blue';

  constructor(
    private gitManager: GitManagerService
  ) { }

  setColor(color: string): void{
    // this.gitManager.get(this.filePath)
    //   .subscribe({
    //     next: (response: any) => {
    //       const layoutData: LayoutData = this.gitManager.getResponseContent(response);
    //       layoutData.backgroundColor = color;
          const layoutData: LayoutData = {
            backgroundColor: color
          }
          this.gitManager.putData(this.gitManager.getGitBody(this.filePath, JSON.stringify(layoutData), this.gitManager.sha));
      //   },
      //   error: e => {
      //     console.log(e);
      //   },
      // });
  }

  getColor(){
    console.log("");
    this.gitManager.get(this.filePath)
      .subscribe({
        next: (response: any) => {
          this.gitManager.sha = response.sha;
          const layoutData: LayoutData = this.gitManager.getResponseContent(response);
          this.color = layoutData.backgroundColor
        },
        error: e => {
          console.log(e);
        },
      });
  }
}
