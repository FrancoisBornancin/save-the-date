import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { NumberContainer } from '../../model/number-container';
import { StringContainer } from '../../model/string-container';

@Injectable({
  providedIn: 'root'
})
export class CommonFacadeService {
  imageFolder!: string
  layoutJsonName!: string

  backgroundPaddingTop: number = 0;
  backgroundHeight: number = 0;
  backgroundWidth: number = 0;
  backgroundColor: string = '';
  backgroundOpacity: number = 0;

  borderColor: string = '';
  borderRadius: number = 0;
  borderSize: number = 0;

  textValue: string = '';
  textColor: string = '';
  textSize: number = 0;
  textPolice: string = '';

  constructor(
    public layoutManager: LayoutManagerService,
  ) { }

  loadData(jsonFileName: string): Observable<any>{
    return this.layoutManager.loadData(jsonFileName);
  }
}
