import { Component, OnInit, ViewChild } from '@angular/core';

import { forkJoin } from 'rxjs';
import { FileUpload } from 'primeng/fileupload';
import { CustomImageData } from '../../../model/image-data';
import { GitManagerService } from '../../../services/git-manager/git-manager.service';
import { ImageDataUtilsService } from '../../../services/image-data-utils/image-data-utils.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import e from 'express';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent implements OnInit{
  mainBackgroundColor!: string;
  imageBackgroundColor!: string;
  dropdownTab!: number[];
  selectedIndex!: number;
  imageUrl!: string;
  imageFolder: string = 'test-images-repository';
  layoutJsonName: string = "test-component-layout.json";

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public layoutManager: LayoutManagerService,
    private gitManager: GitManagerService,
    public imageDataUtils: ImageDataUtilsService,
    private componentFacade: ComponentFacadeService
  ){

  }

  ngOnInit(): void {
    this.layoutManager.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.initImplicitDependencies(response);
        this.setElements(1);
        this.loadAllImageData();
        this.setDropdown();
      },
      error: e => {
        console.log(e);
      },
    });
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

  loadLayoutDataDropdown(event: any){
    this.layoutManager.updateCurrentLayoutDataTab()
    this.setElements(event.value);
    this.loadImageData(event.value);
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
    this.layoutManager.saveData(this.selectedIndex, this.layoutJsonName);
  }

  saveImage(){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.imageUrl);
    this.imageDataUtils.saveImageData(this.selectedIndex, imageData, this.imageFolder);
  }

  private setElements(index: number){
    const element = this.componentFacade.getElements(index);
    this.imageUrl = element.imageUrl;
    this.imageBackgroundColor = element.imageBackgroundColor;
    this.mainBackgroundColor = element.mainBackgroundColor;
  }

  private setDropdown(){
    this.dropdownTab =
     this.layoutManager.layoutDataTabFromDb
      .map(element => element.key)
      .sort((a, b) => (a - b))
      ;
  }

  private setLayoutData(){
    this.layoutManager.layoutData.mainBackgroundColor = this.mainBackgroundColor;
    this.layoutManager.layoutData.imageBackgroundColor = this.imageBackgroundColor;
  }

  private loadImageData(index: number){
    this.imageUrl = this.imageDataUtils.loadIndexedImageUrl(index);
  }

  private loadAllImageData() {
    this.imageDataUtils.bigImageTab =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    const tasks = this.imageDataUtils.bigImageTab.map(element => this.imageDataUtils.fillBigImageTab(element.key, this.imageFolder));

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

  // private loadLayoutData(index: number){
  //   // this.selectedIndex = index;
  //   this.layoutManager.updateCurrentLayoutData(index);
  //   this.layoutManager.layoutData.hasBeenSaved = '';
  //   // this.mainBackgroundColor = this.layoutManager.layoutData.mainBackgroundColor;
  //   // this.imageBackgroundColor = this.layoutManager.layoutData.imageBackgroundColor;

  //   // this.imageUrl = '';

  //   return {
  //     imageUrl: '',
  //     mainBackgroundColor: this.layoutManager.layoutData.mainBackgroundColor,
  //     imageBackgroundColor: this.layoutManager.layoutData.imageBackgroundColor
  //   }
  // }
}
