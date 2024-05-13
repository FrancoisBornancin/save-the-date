import { Injectable } from '@angular/core';
import { CustomImageData } from '../../model/image-data';
import { GitManagerService } from '../git-manager/git-manager.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenManagerService } from '../token-manager/token-manager.service';
import { Observable } from 'rxjs';
import { GitBody } from '../../model/git-body';

@Injectable({
  providedIn: 'root'
})
export class ImageDataUtilsService {
  imageUrl!: string;
  startFinalPath: string = 'image-content-';
  endFinalPath: string = '.txt'
  finalPath!: string;
  hasBeenSaved!: string;

  constructor(
    private gitManager: GitManagerService,
    private http: HttpClient,
    private tokenManager: TokenManagerService
  ){

  }

  constructFinalPath(index: number){
    this.finalPath = this.startFinalPath + index + this.endFinalPath;
  }

  getBlobContent(response: any): Observable<any>{
    this.gitManager.sha = response.sha;

    const blobUrl = this.gitManager.getBlobUrl(response);

    return this.http.get(blobUrl, { headers: this.gitManager.getHeaders(), responseType: 'json' })
  }

  loadImageData(index: number): Observable<any>{
    this.constructFinalPath(1);
    return this.gitManager.get(this.finalPath);
  }

  putData(imageData: CustomImageData, response: any): Observable<any>{
    this.gitManager.sha = response.sha;

    const gitBody: GitBody = this.gitManager.getGitBody(this.finalPath, imageData.imageUrlContent, this.gitManager.sha.toString())
    return this.gitManager.putData(gitBody)
  }

  saveImageData(index: number, imageData: CustomImageData){
    this.loadImageData(index)
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

  getBlob(imageData: CustomImageData): Blob{
  const byteCharacters = atob(imageData.imageUrlContent);

  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

    return new Blob([byteArray], { type: 'image/jpeg' });
  }
}
