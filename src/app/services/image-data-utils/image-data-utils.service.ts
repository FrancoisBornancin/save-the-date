import { Injectable } from '@angular/core';
import { CustomImageData } from '../../model/image-data';
import { GitManagerService } from '../git-manager/git-manager.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenManagerService } from '../token-manager/token-manager.service';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { GitBody } from '../../model/git-body';
import { BigImageData } from '../../model/big-image-data';

@Injectable({
  providedIn: 'root'
})
export class ImageDataUtilsService {
  imageUrl!: string;
  startFinalPath: string = 'image-content-';
  endFinalPath: string = '.txt'
  finalPath!: string;
  hasBeenSaved!: string;
  bigImageTab!: BigImageData[];

  constructor(
    private gitManager: GitManagerService,
    private http: HttpClient,
  ){

  }

  saveImageData(index: number, imageData: CustomImageData, folder: string){
    this.hasBeenSaved = 'ImageSave is processing';
    this.loadImageData(index, folder)
    .subscribe({
      next: (response: any) => {
        this.putData(imageData, response)
        .subscribe({
          next: e => {
            this.hasBeenSaved = 'ImageSave has succeed';
          },
          error: e => {
            this.hasBeenSaved = 'ImageSave has failed';
          },
        });
      },
      error: e => {
        console.log(e);
      },
    });
  }

  getImageData(imageUrl: string): CustomImageData{
    const imageUrlSplitted = imageUrl.split(',');

    return {
      imageUrlPath: imageUrlSplitted[0],
      imageUrlContent: imageUrlSplitted[1],
    }
  }

  setImageContent(imageUrl: string, index: number){
    this.bigImageTab
    .filter(element => element.key == index)
    .at(0)!
    .imageUrlContent = imageUrl
    ;
  }

  loadIndexedImageUrl(index: number): string{
    return this.bigImageTab
    .filter(element => element.key == index)
    .map(element => element.imageUrlContent)
    .at(0)!
    ;
  }

  fillBigImageTab(index: number, folder: string): Observable<any> {
    return this.loadImageData(index, folder).pipe(
      switchMap(response => this.getBlobContent(response)),
      map(data => {
        const imageContent = "data:image/jpeg;base64," + atob(data.content);
        const element = this.bigImageTab.find(el => el.key === index);
        if (element) {
          element.imageUrlContent = imageContent;
        }
        return element; 
      }),
      catchError(error => {
        console.error(error);
        return throwError(() => new Error(error));
      })
    );
  }

  private constructFinalPath(index: number, folder: string){
    this.finalPath = folder + "/" + this.startFinalPath + index + this.endFinalPath;
  }

  private getBlobContent(response: any): Observable<any>{
    this.gitManager.sha = response.sha;

    const blobUrl = this.gitManager.getBlobUrl(response);

    return this.http.get(blobUrl, { headers: this.gitManager.getHeaders(), responseType: 'json' })
  }

  private loadImageData(index: number, folder: string): Observable<any>{
    this.constructFinalPath(index, folder);
    return this.gitManager.get(this.finalPath);
  }

  private putData(imageData: CustomImageData, response: any): Observable<any>{
    this.gitManager.sha = response.sha;

    const gitBody: GitBody = this.gitManager.getGitBody(this.finalPath, imageData.imageUrlContent, this.gitManager.sha.toString())
    return this.gitManager.putData(gitBody)
  }
}
