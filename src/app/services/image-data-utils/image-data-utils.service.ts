import { Injectable } from '@angular/core';
import { CustomImageData } from '../../model/image-data';
import { GitManagerService } from '../git-manager/git-manager.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenManagerService } from '../token-manager/token-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDataUtilsService {
  imageUrl!: string;

  constructor(
    private gitManager: GitManagerService,
    private http: HttpClient,
    private tokenManager: TokenManagerService
  ){

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
