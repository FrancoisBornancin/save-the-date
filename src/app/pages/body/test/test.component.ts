import { Component, OnInit, ViewChild } from '@angular/core';

import { forkJoin } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { CustomImageData } from '../../../model/image-data';
import { GitManagerService } from '../../../services/git-manager/git-manager.service';
import { ImageManagerService } from '../../../services/image-manager/image-manager.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { InMemoryRepositoryService } from '../../../services/in-memory-repository/in-memory-repository.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
  ){
    this.inMemoryRepository.imageFolder = 'repository/test-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/test-component-layout.json';
  } 
}
