import { Injectable } from '@angular/core';
import { GitManagerService } from '../git-manager/git-manager.service';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { CustomImageData } from '../../model/image-data';
import { Observable } from 'rxjs/internal/Observable';
import { LayoutData } from '../../model/layout-data/layout-data';
import { MenuItem } from 'primeng/api';
import { DataRenderedContainer } from '../../model/data-rendered-container';
import { NumberContainer } from '../../model/number-container';
import { StringContainer } from '../../model/string-container';
import { CommonFacadeService } from '../common-facade/common-facade.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { LayoutDaoService } from '../layout-dao/layout-dao.service';
import { ImageDaoService } from '../image-dao/image-dao.service';

@Injectable({
  providedIn: 'root'
})
export class AdminFacadeService {
  constructor(
    public layoutManager: LayoutManagerService,
    public gitManager: GitManagerService,
    public imageDataUtils: ImageManagerService,
    public commonFacade: CommonFacadeService,
    public imageDao: ImageDaoService,
    public selectedIndexService: SelectedIndexService
  ) { }

  initTasks(imageFolder: string){
    this.imageDataUtils.bigImageTab =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    this.imageDataUtils.bigImageTabFromDb =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    return this.imageDataUtils.bigImageTab.map(element => this.imageDataUtils.fillBigImageTab(element.key, imageFolder));
  }
}
