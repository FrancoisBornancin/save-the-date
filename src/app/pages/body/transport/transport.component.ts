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
  templateUrl: './transport.component.html',
  styleUrl: './transport.component.scss'
})
export class TransportComponent {
  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
  ){
    this.inMemoryRepository.belowImageFolder = 'repository/below-transport-images-repository';
    this.inMemoryRepository.upperImageFolder = 'repository/upper-transport-images-repository';
    this.inMemoryRepository.layoutJsonName = 'json-layout/transport-component-layout.json';
  } 
}
