import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ButtonManagerService } from '../../../services/button-manager/button-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { CommonFacadeService } from '../../../services/common-facade/common-facade.service';
import { ImageDaoService } from '../../../services/image-dao/image-dao.service';
import { ImageManagerService } from '../../../services/image-manager/image-manager.service';
import { LayoutDaoService } from '../../../services/layout-dao/layout-dao.service';
import { LayoutManagerService } from '../../../services/layout-manager/layout-manager.service';
import { SelectedIndexService } from '../../../services/selected-index/selected-index.service';
import { fontFamily } from '../../font-family';
import { ThreadPoolExecutorService } from '../../../services/thread-pool-executor/thread-pool-executor.service';

@Component({
  selector: 'app-base-body',
  templateUrl: './base-body.component.html',
  styleUrl: './base-body.component.scss'
})
export class BaseBodyComponent implements OnInit{
  generalInfoModalRendered: boolean = false;

  policeTab!: string[];

  @ViewChild('fileUploader') fileUpload!: FileUpload;

  constructor(
    public commonFacade: CommonFacadeService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public buttonManager: ButtonManagerService,
    public layoutManager: LayoutManagerService,
    public imageManager: ImageManagerService,
    public selectedIndex: SelectedIndexService,
    public layoutDao: LayoutDaoService,
    public imageDao: ImageDaoService,
    public threadPoolExecutor: ThreadPoolExecutorService
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
    this.imageManager.loadImageForUser(this.commonFacade.imageFolder)
    .subscribe({
      next: (response: any) => {
        this.commonFacade.imageUrl = response;
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
        this.layoutManager.initLayoutDataTabs(response);
        this.layoutManager.setLayoutElements(1);
        this.wrapForkJoin()
        .subscribe({
          next: (results) => {
            console.log("Toutes les images ont été chargées", results);

            this.selectedIndex.index = 1;
            this.commonFacade.imageUrl = this.imageDao.getImageUrl();

            this.buttonManager.initUiButtons();

            this.buttonManager.initSaveUploadButtons()
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

  getImageUrl(){
    return "background-image: url(" + this.commonFacade.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "padding-top: " + this.commonFacade.backgroundPaddingTop + "%;"
         + "height: 100%;"
  }

  wrapForkJoin(): Observable<any[]>{
    return forkJoin(
      this.threadPoolExecutor.initTasks(this.commonFacade.imageFolder)
    )
  }

  textStyle(){
    return 'color: ' + this.commonFacade.textColor + ";"
          + 'font-size: ' + this.commonFacade.textSize + "px;"
          + 'font-family: "Playwrite ' + this.commonFacade.textPolice + '", cursive;'
  }

  getImageBackgroundStyle(): string{
      const backgroundColor =
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.commonFacade.backgroundColor),
        (this.commonFacade.backgroundOpacity/100)
       ) + ";"
    return "height: " + this.commonFacade.backgroundHeight + "%;"
         + "width: " + this.commonFacade.backgroundWidth + "%;"
         + "border-radius: " + this.commonFacade.borderRadius + "%;"
         + "border: " + this.commonFacade.borderSize + "px solid " + this.commonFacade.borderColor + ";"
         + "margin: auto;"
         + backgroundColor
  }

  printGeneralInfoModal(){
    if(this.generalInfoModalRendered){
      this.generalInfoModalRendered = false;
    }else{
      this.generalInfoModalRendered = true;
    }
  }

  upload(event: any){
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

    let file = event.files[0];
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.commonFacade.imageUrl = e.target.result;
      this.imageManager.setImageContent();
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
}
