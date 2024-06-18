import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { ComponentFacadeService } from '../../../services/component-facade/component-facade.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { StringToHtmlService } from '../../../services/string-to-html/string-to-html.service';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { LayoutData } from '../../../model/layout-data';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{
  imageBackgroundColor!: string;
  imageText!: string;
  height!: number;
  width!: number;
  opacity!: number;
  dropdownTab!: number[];
  selectedIndex!: number;
  imageUrl!: string;
  @Input() imageFolder!: string
  @Input() layoutJsonName!: string

  colorRendered: boolean = false;

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public componentFacade: ComponentFacadeService,
    public stringToHtmlService: StringToHtmlService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService
  ){

  }

  getImageUrl(){
    return "background-image: url(" + this.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "height: 100%;"
  }

  stringToHtml(){
      return this.stringToHtmlService.replaceString(this.imageText);
  }

  wrapForkJoin(): Observable<any[]>{
    return forkJoin(
      this.componentFacade.initTasks(this.imageFolder)
    )
  }

  ngOnInit(): void {
    this.componentFacade.loadData(this.layoutJsonName)
    .subscribe({
      next: (response: any) => {
        this.componentFacade.initImplicitDependencies(response);
        this.setLayoutElements(1);
        this.wrapForkJoin()
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

  increaseData(data: string, value: number){
    if(data == 'opacity' && this.opacity != 100) this.opacity += value;
    if(data == 'height') this.height += value;
    if(data == 'width') this.width += value;
  }

  decreaseData(data: string, value: number){
    if(data == 'opacity' && this.opacity != 0) this.opacity -= value;
    if(data == 'height' && this.height != 0) this.height -= value;
    if(data == 'width' && this.width != 0) this.width -= value;
  }

  getImageBackgroundStyle(): string{
    this.setLayoutData();
    let backgroundColor = '';
    if(this.colorRendered){
      backgroundColor =
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.imageBackgroundColor),
        (this.opacity/100)
       ) + ";"
    }
    return "height: " + this.height + "%;"
         + "width: " + this.width + "%;"
         + "margin: auto;"
         + backgroundColor
  }

  printColor(){
    this.colorRendered = true;
  }

  doNotPrintColor(){
    this.colorRendered = false;
  }

  loadLayoutDataDropdown(event: any){
    this.selectedIndex = event.value
    this.componentFacade.updateCurrentLayoutDataTab()
    this.setLayoutElements(event.value);
    this.imageUrl = this.componentFacade.getImageUrl(event.value);
  }

  upload(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

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

  private setLayoutElements(index: number){
    const element = this.componentFacade.getLayoutElements(index);
    this.imageUrl = element.imageUrl;
    this.imageBackgroundColor = element.layoutData.imageBackgroundColor;
    this.height = element.layoutData.height;
    this.width = element.layoutData.width;
    this.opacity = element.layoutData.opacity;
    this.imageText = element.layoutData.imageText;
  }

  private setLayoutData(){
    const layoutData: LayoutData = {
      key: 0,
      height: this.height,
      width: this.width,
      opacity: this.opacity,
      imageBackgroundColor: this.imageBackgroundColor,
      imageText: this.imageText,
      hasBeenSaved: ''
    }
    this.componentFacade.setLayoutData(layoutData);
  }
}
