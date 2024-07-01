import { Component, OnInit, ViewChild } from '@angular/core';

import { forkJoin } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { CustomImageData } from '../../../model/image-data';
import { GitManagerService } from '../../../services/git-manager/git-manager.service';
import { ImageManagerService } from '../../../services/image-manager/image-manager.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
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
