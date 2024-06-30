import { Component, OnInit, ViewChild } from '@angular/core';

import { forkJoin } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { CustomImageData } from '../../../model/image-data';
import { GitManagerService } from '../../../services/git-manager/git-manager.service';
import { ImageDataUtilsService } from '../../../services/image-data-utils/image-data-utils.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { AdminFacadeService } from '../../../services/admin-facade/admin-facade.service';
import { CommonFacadeService } from '../../../services/common-facade/common-facade.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  constructor(
    public commonFacade: CommonFacadeService,
  ){
    this.commonFacade.imageFolder = 'repository/test-images-repository';
    this.commonFacade.layoutJsonName = 'json-layout/test-component-layout.json';
  } 
}
