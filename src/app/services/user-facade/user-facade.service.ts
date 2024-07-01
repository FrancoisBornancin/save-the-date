import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';

@Injectable({
  providedIn: 'root'
})
export class UserFacadeService {
  readonly userIndex: number = 0;

  constructor(
    public layoutManager: LayoutManagerService,
    public gitManager: GitManagerService,
    public imageDataUtils: ImageManagerService,
  ) { }

  getLayout(response: any){
    this.layoutManager.layoutData
      = this.gitManager.getStringifyResponseContent(response)
        .filter((element: { key: number; }) => element.key == this.userIndex)
        .at(0)!
  }
}
