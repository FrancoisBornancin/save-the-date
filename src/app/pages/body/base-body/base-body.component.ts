import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { FileUpload } from 'primeng/fileupload';
import { Observable, forkJoin } from 'rxjs';
import { DataRenderedContainer } from '../../../model/data-rendered-container';
import { LayoutData } from '../../../model/layout-data/layout-data';
import { AdminFacadeService } from '../../../services/admin-facade/admin-facade.service';
import { AdminManagerService } from '../../../services/admin-manager/admin-manager.service';
import { ColorConvertorService } from '../../../services/color-to-rgba/color-convertor.service';
import { CommonFacadeService } from '../../../services/common-facade/common-facade.service';
import { UserFacadeService } from '../../../services/user-facade/user-facade.service';
import { fontFamily } from '../../font-family';
import { ButtonManagerService } from '../../../services/button-manager/button-manager.service';
import { SelectedIndexService } from '../../../services/selected-index/selected-index.service';
import { LayoutDaoService } from '../../../services/layout-dao/layout-dao.service';

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
    public adminFacade: AdminFacadeService,
    public userFacade: UserFacadeService,
    public commonFacade: CommonFacadeService,
    public colorConvertor: ColorConvertorService,
    public adminManager: AdminManagerService,
    public buttonManager: ButtonManagerService,
    public selectedIndex: SelectedIndexService,
    public layoutDao: LayoutDaoService
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
        this.userFacade.getLayout(response);
        this.setLayoutElementsForUser();
      },
      error: e => {
        console.log(e);
      },
    });
    this.adminFacade.imageDataUtils
    .loadImageForUser(this.commonFacade.imageFolder)
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
        this.adminFacade.initImplicitDependencies(response);
        this.adminFacade.setLayoutElements(1);
        this.wrapForkJoin()
        .subscribe({
          next: (results) => {
            console.log("Toutes les images ont été chargées", results);
            this.commonFacade.imageUrl = this.adminFacade.getImageUrl(1);

            this.selectedIndex.index = 1;

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

  setLayoutElementsForUser(){
    const layoutData = this.adminFacade.layoutManager.layoutData;

    this.commonFacade.backgroundColor = layoutData.backgroundData.color;
    this.commonFacade.backgroundHeight = layoutData.backgroundData.height;
    this.commonFacade.backgroundWidth = layoutData.backgroundData.width;
    this.commonFacade.backgroundOpacity = layoutData.backgroundData.opacity;
    this.commonFacade.backgroundPaddingTop = layoutData.backgroundData.paddingTop

    this.commonFacade.borderColor = layoutData.borderData.color
    this.commonFacade.borderRadius = layoutData.borderData.radius
    this.commonFacade.borderSize = layoutData.borderData.size

    this.commonFacade.textValue = layoutData.textData.value;
    this.commonFacade.textColor = layoutData.textData.color;
    this.commonFacade.textSize = layoutData.textData.size;
    this.commonFacade.textPolice = layoutData.textData.police;
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
      this.adminFacade.initTasks(this.commonFacade.imageFolder)
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
      this.adminFacade.setImageContent(this.commonFacade.imageUrl, this.selectedIndex.index);
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
}
