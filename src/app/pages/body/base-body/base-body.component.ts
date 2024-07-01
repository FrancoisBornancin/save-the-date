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
    public inMemoryRepository: InMemoryRepositoryService,
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
    this.imageManager.loadImageForUser(this.inMemoryRepository.imageFolder)
    .subscribe({
      next: (response: any) => {
        this.imageManager.imageUrl = response;
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
        this.wrapForkJoin(imagesIndexes)
        .subscribe({
          next: (results) => {
            console.log("Toutes les images ont été chargées", results);

            this.selectedIndex.index = 1;
            this.imageManager.imageUrl = this.imageDao.getImageUrl();

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
    return "background-image: url(" + this.imageManager.imageUrl + ");"
         + "background-size: contain;"
         + "background-repeat: no-repeat;"
         + "padding-top: " + this.layoutManager.backgroundPaddingTop + "%;"
         + "height: 100%;"
  }

  wrapForkJoin(imagesIndexes: number[]): Observable<any[]>{
    return forkJoin(
      this.threadPoolExecutor.initTasks(this.inMemoryRepository.imageFolder, imagesIndexes)
    )
  }

  textStyle(){
    return 'color: ' + this.layoutManager.textColor + ";"
          + 'font-size: ' + this.layoutManager.textSize + "px;"
          + 'font-family: "Playwrite ' + this.layoutManager.textPolice + '", cursive;'
  }

  getImageBackgroundStyle(): string{
      const backgroundColor =
       "background-color: " + this.colorConvertor.addOpacity(
        this.colorConvertor.convertToRgba(this.layoutManager.backgroundColor),
        (this.layoutManager.backgroundOpacity/100)
       ) + ";"
    return "height: " + this.layoutManager.backgroundHeight + "%;"
         + "width: " + this.layoutManager.backgroundWidth + "%;"
         + "border-radius: " + this.layoutManager.borderRadius + "%;"
         + "border: " + this.layoutManager.borderSize + "px solid " + this.layoutManager.borderColor + ";"
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
      this.imageManager.imageUrl = e.target.result;
      this.imageManager.setImageContent();
      this.fileUpload.clear();
    };

    reader.readAsDataURL(file);
  }
}
