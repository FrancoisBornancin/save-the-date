import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ButtonManagerService } from '../../../services/button-manager/button-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { InMemoryRepositoryService } from '../../../services/in-memory-repository/in-memory-repository.service';
import { ImageDaoService } from '../../../services/image-dao/image-dao.service';
import { ImageManagerService } from '../../../services/image-manager/image-manager.service';
import { LayoutDaoService } from '../../../services/layout-dao/layout-dao.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { SelectedIndexService } from '../../../services/selected-index/selected-index.service';
import { fontFamily } from '../../font-family';
import { ThreadPoolExecutorService } from '../../../services/thread-pool-executor/thread-pool-executor.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{
  generalInfoModalRendered: boolean = false;

  policeTab!: string[];

  @ViewChild('upperFileUploader') upperFileUploader!: FileUpload;
  @ViewChild('belowFileUploader') belowFileUploader!: FileUpload;

  constructor(
    public inMemoryRepository: InMemoryRepositoryService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public buttonManager: ButtonManagerService,
    public layoutManager: LayoutManagerService,
    public imageManager: ImageManagerService,
    public selectedIndex: SelectedIndexService,
    public layoutDao: LayoutDaoService,
    public imageDao: ImageDaoService,
    public threadPoolExecutor: ThreadPoolExecutorService,
    private domSanitizer: DomSanitizer
  ){
    this.buttonManager.initLoadButtons();
  }

  ngOnInit(): void {
    if(this.adminManager.isAdminModeActive){
      this.initForAdmin();
    }else{
      this.initForUser();
    }
  }

  initForUser(){
    this.layoutDao.loadData()
    .subscribe({
      next: (response: any) => {
        this.layoutManager.setLayoutForUser(response);
      },
      error: e => {
        console.log(e);
      },
    });
    this.imageManager.loadImageForUser(this.inMemoryRepository.upperImageFolder)
    .subscribe({
      next: (response: any) => {
        this.imageManager.upperImageUrl = response;
      },
      error: e => {
        console.log(e);
      },
    });
  }

  initForAdmin(){
    this.policeTab = this.initPoliceTab();

    this.layoutDao.loadData()
    .subscribe({
      next: (response: any) => {
        const imagesIndexes: number[] = [0, 1, 2, 3, 4, 5];

        this.layoutManager.initLayoutDataTabs(response);
        this.layoutManager.setLayoutElements(1);
        this.wrapForkJoin(imagesIndexes, 'upper')
        .subscribe({
          next: (results) => {
            this.wrapForkJoin(imagesIndexes, 'below')
            .subscribe({
              next: (results) => {
                console.log("Toutes les images ont été chargées", results);
    
                this.selectedIndex.index = 1;
                this.imageManager.upperImageUrl = this.imageDao.getImageUrl('upper');
                this.imageManager.belowImageUrl = this.imageDao.getImageUrl('below');
    
                this.buttonManager.initUiButtons();
    
                this.buttonManager.initSaveUploadUpperButtons()
              },
              error: (error) => {
                console.error("Erreur lors du chargement des images", error);
              }
            });
          },
          error: (error) => {
            console.error("Erreur lors du chargement des images", error);
          }
        });
      },
      error: e => {
        console.log(e);
      },
    });
  }

  initPoliceTab(): string[]{
    return fontFamily
            .split("?")[1]
            .split("&")
            .filter(element => element != 'display=swap')
            .map(element => {
              let policeName =
                element
                  .split("Playwrite+")[1]
                  .split(":")[0]

              policeName =
                policeName.includes("+") ? policeName.split("+").join(" ") : policeName
              return policeName
            })
  }

  getBelowImageUrl(){
    return "background-image: url(" + this.imageManager.belowImageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "padding-top: " + this.layoutManager.belowImageBackgroundPaddingTop + "%;"
         + "height: 100%;"
  }

  getUpperImageUrl(){
    return "background-image: url(" + this.imageManager.upperImageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "padding-top: " + this.layoutManager.upperImageBackgroundPaddingTop + "%;"
         + "height: 60%;"
  }

  wrapForkJoin(imagesIndexes: number[], prefix: string): Observable<any[]>{
    return forkJoin(
      this.threadPoolExecutor.initTasks(imagesIndexes, prefix)
    )
  }

  textStyle(){
    return 'color: ' + this.layoutManager.upperImageTextColor + ";"
          + 'font-size: ' + this.layoutManager.upperImageTextSize + "px;"
          + 'font-family: "Playwrite ' + this.layoutManager.upperImageTextPolice + '", cursive;'
  }

  textBelowStyle(){
    return 'color: ' + this.layoutManager.belowImageTextColor + ";"
          + 'font-size: ' + this.layoutManager.belowImageTextSize + "px;"
          + 'font-family: "Playwrite ' + this.layoutManager.belowImageTextPolice + '", cursive;'
  }

  getUpperImageBackgroundStyle(): string{
      const backgroundColor =
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.layoutManager.upperImageBackgroundColor),
        (this.layoutManager.upperImageBackgroundOpacity/100)
       ) + ";"
    return "height: " + this.layoutManager.upperImageBackgroundHeight + "%;"
         + "width: " + this.layoutManager.upperImageBackgroundWidth + "%;"
         + "border-radius: " + this.layoutManager.upperImageBorderRadius + "%;"
         + "border: " + this.layoutManager.upperImageBorderSize + "px solid " + this.layoutManager.upperImageBorderColor + ";"
         + "margin: auto;"
         + backgroundColor
  }

  getBelowImageBackgroundStyle(): string{
    const backgroundColor =
     "background-color: " + this.colorConvertor.addOpacity(
      this.colorConvertor.convertToRgba(this.layoutManager.belowImageBackgroundColor),
      (this.layoutManager.belowImageBackgroundOpacity/100)
     ) + ";"
  return "height: " + this.layoutManager.belowImageBackgroundHeight + "%;"
       + "width: " + this.layoutManager.belowImageBackgroundWidth + "%;"
       + "border-radius: " + this.layoutManager.belowImageBorderRadius + "%;"
       + "border: " + this.layoutManager.belowImageBorderSize + "px solid " + this.layoutManager.belowImageBorderColor + ";"
       + "margin: auto;"
       + backgroundColor
}

  reworkUpperTextValue(): SafeHtml{
    const textReworked = this.layoutManager.upperImageTextValue.split('class="ql-align-center"')
                        .join('style="text-align: center;"');

    return this.domSanitizer.bypassSecurityTrustHtml(
      textReworked
    );
  }

  reworkBelowTextValue(): SafeHtml{
    const textReworked = this.layoutManager.belowImageTextValue.split('class="ql-align-center"')
                        .join('style="text-align: center;"');

    return this.domSanitizer.bypassSecurityTrustHtml(
      textReworked
    );
  }

  printGeneralInfoModal(){
    if(this.generalInfoModalRendered){
      this.generalInfoModalRendered = false;
    }else{
      this.generalInfoModalRendered = true;
    }
  }

  uploadUpper(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

    let file = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageManager.upperImageUrl = e.target.result;
      this.imageManager.setImageContent('upper');
      this.upperFileUploader.clear();
    };

    reader.readAsDataURL(file);
  }

  uploadBelow(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

    let file = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageManager.belowImageUrl = e.target.result;
      this.imageManager.setImageContent('below');
      this.belowFileUploader.clear();
    };

    reader.readAsDataURL(file);
  }
}
