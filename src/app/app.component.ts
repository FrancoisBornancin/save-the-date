import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GitManagerService } from './services/git-manager/git-manager.service';
import { TokenManagerService } from './services/token-manager/token-manager.service';
import { LayoutManagerService } from './services/layout-manager/layout-manager.service';
import { ImageDataUtilsService } from './services/image-data-utils/image-data-utils.service';
import { CustomImageData } from './model/image-data';
import { GitBody } from './model/git-body';
import { BigImageData } from './model/big-image-data';
import { forkJoin } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  mainBackgroundColor!: string;
  imageBackgroundColor!: string;
  dropdownTab!: number[];
  selectedIndex!: number;
  imageUrl!: string;

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public layoutManager: LayoutManagerService,
    private gitManager: GitManagerService,
    public imageDataUtils: ImageDataUtilsService,
    private tokenManager: TokenManagerService,
    private http: HttpClient,
  ){

  }

  ngOnInit(): void {
    this.layoutManager.loadData()
    .subscribe({
      next: (response: any) => {
        this.gitManager.sha = response.sha;
        this.layoutManager.layoutDataTabFromDb = this.gitManager.getStringifyResponseContent(response);
        this.layoutManager.layoutDataTabCurrent = this.gitManager.getStringifyResponseContent(response);
        this.loadLayoutData(1);
        this.loadAllImageData();
        this.setDropdown();
      },
      error: e => {
        console.log(e);
      },
    });
  }

  setDropdown(){
    console.log("");
    this.dropdownTab = 
     this.layoutManager.layoutDataTabFromDb
      .map(element => element.key)
      .sort((a, b) => (a - b))
      ;
  }

  getMainBackgroundStyle(): string{
    this.setLayoutData();

    let realColor: string;
    if(this.mainBackgroundColor == undefined) realColor = 'blue';
    else realColor = this.mainBackgroundColor
    return 'background-color: ' + realColor + '; height: 100%;'
  }

  getImageBackgroundStyle(): string{
    this.setLayoutData();

    let realColor: string;
    if(this.imageBackgroundColor == undefined) realColor = 'blue';
    else realColor = this.imageBackgroundColor
    return 'background-color: ' + realColor + '; height: 50%; width: 50%; margin: auto;'
  }

  setLayoutData(){
    this.layoutManager.layoutData.mainBackgroundColor = this.mainBackgroundColor;
    this.layoutManager.layoutData.imageBackgroundColor = this.imageBackgroundColor;
  }

  loadImageData(index: number){
    console.log("");
    this.imageUrl = 
      this.imageDataUtils.bigImageTab
        .filter(element => element.key == index)
        .map(element => element.imageUrlContent)
        .at(0)!;
  }

  loadAllImageData() {
    this.imageDataUtils.bigImageTab =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key} 
      })

    const tasks = this.imageDataUtils.bigImageTab.map(element => this.imageDataUtils.fillBigImageTab(element.key));
  
    forkJoin(tasks).subscribe({
      next: (results) => {
        console.log("Toutes les images ont été chargées", results);
        this.loadImageData(1);
      },
      error: (error) => {
        console.error("Erreur lors du chargement des images", error);
      }
    });
  }

  loadLayoutDataDropdown(event: any){
    this.layoutManager.layoutDataTabCurrent =
      this.layoutManager.layoutDataTabCurrent
        .filter(element => element.key != this.layoutManager.layoutData.key)
        ;

    this.layoutManager.layoutDataTabCurrent.push(this.layoutManager.layoutData);

    this.loadLayoutData(event.value)
    this.loadImageData(event.value);
  }

  loadLayoutData(index: number){
    this.selectedIndex = index;
    this.layoutManager.layoutData =
      this.layoutManager.layoutDataTabCurrent
        .filter(layoutData => layoutData.key == index)
        [0]
        ;
    this.layoutManager.layoutData.hasBeenSaved = '';
    this.mainBackgroundColor = this.layoutManager.layoutData.mainBackgroundColor;
    this.imageBackgroundColor = this.layoutManager.layoutData.imageBackgroundColor;

    this.imageUrl = '';
  }

  upload(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }
    console.log("");

    let file = event.files[0];
    let reader = new FileReader();
    
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.imageDataUtils.setImageContent(this.imageUrl, this.selectedIndex);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  saveLayout(){
    this.layoutManager.saveData(this.selectedIndex);
  }

  saveImage(){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.imageUrl);

    this.imageDataUtils.saveImageData(this.selectedIndex, imageData);
  }
}
