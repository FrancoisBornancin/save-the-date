import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { forkJoin } from 'rxjs';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{
  mainBackgroundColor!: string;
  imageBackgroundColor!: string;
  dropdownTab!: number[];
  selectedIndex!: number;
  imageUrl!: string;
  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService
  ){

  }

  printLineBreaks(){

    return this.componentFacade
            .layoutManager
            .layoutData
            .imageText
            .replace('esp', '<br>')
  }

  getImageUrl(){
    return "background-image: url(" + this.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "height: 100%;"
  }

  ngOnInit(): void {
    this.componentFacade.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.initImplicitDependencies(response);
        this.setElements(1);
      forkJoin(
        this.componentFacade.initTasks(this.imageFolder)
      )
      .subscribe({
        next: (results) => {
          console.log("Toutes les images ont été chargées", results);
          this.imageUrl = this.componentFacade.getImageUrl(1);
        },
        error: (error) => {
          console.error("Erreur lors du chargement des images", error);
        }
      });
        this.dropdownTab = this.componentFacade.getDropdownIndexes();
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
    this.selectedIndex = event.value
    this.componentFacade.updateCurrentLayoutDataTab()
    this.setElements(event.value);
    this.imageUrl = this.componentFacade.getImageUrl(event.value);
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
      this.componentFacade.setImageContent(this.imageUrl, this.selectedIndex);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }

  saveLayout(){
    this.componentFacade.saveLayout(this.selectedIndex, this.layoutJsonName);
  }

  saveImage(){
    this.componentFacade.saveImage(this.imageUrl, this.imageFolder, this.selectedIndex);
  }

  private setElements(index: number){
    const element = this.componentFacade.getElements(index);
    this.imageUrl = element.imageUrl;
    this.imageBackgroundColor = element.imageBackgroundColor;
    this.mainBackgroundColor = element.mainBackgroundColor;
  }

  private setLayoutData(){
    this.componentFacade.setLayoutData('mainBackgroundColor', this.mainBackgroundColor);
    this.componentFacade.setLayoutData('imageBackgroundColor', this.imageBackgroundColor);
  }
}
