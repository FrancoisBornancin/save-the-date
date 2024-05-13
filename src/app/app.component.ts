import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GitManagerService } from './services/git-manager/git-manager.service';
import { TokenManagerService } from './services/token-manager/token-manager.service';
import { LayoutManagerService } from './services/layout-manager/layout-manager.service';
import { ImageDataUtilsService } from './services/image-data-utils/image-data-utils.service';
import { CustomImageData } from './model/image-data';
import { GitBody } from './model/git-body';

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
        this.loadImageData();
        this.setDropdown();
      },
      error: e => {
        console.log(e);
      },
    });
  }

  setDropdown(){
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

  loadImageData(){
    // this.imageDataUtils.constructFinalPath(1);
    // this.gitManager.get(this.imageDataUtils.finalPath)
    this.imageDataUtils.loadImageData(1)
    .subscribe({
      next: (response: any) => {
        this.imageDataUtils.getBlobContent(response)
          .subscribe({
            next: (data: any) => {
              this.imageUrl = "data:image/jpeg;base64" + "," + atob(data.content);
            },
            error: e => {
              console.log(e);
            },
          });
      },
      error: e => {
        console.log(e);
      },
    });
  }

  loadLayoutDataDropdown(event: any){
    this.layoutManager.layoutDataTabCurrent =
      this.layoutManager.layoutDataTabCurrent
        .filter(element => element.key != this.layoutManager.layoutData.key)
        ;

    this.layoutManager.layoutDataTabCurrent.push(this.layoutManager.layoutData);

    this.loadLayoutData(event.value)
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
    };

    reader.readAsDataURL(file);
  }

  saveLayout(){
    this.layoutManager.saveData(this.selectedIndex);
  }

  saveImage(){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.imageUrl);

    this.imageDataUtils.saveImageData(1, imageData);
  }
}
