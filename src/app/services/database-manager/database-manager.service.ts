import { Injectable } from '@angular/core';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { LayoutData } from '../../model/layout-data/layout-data';


@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {
  layoutDataFromDb!: LayoutData
  layoutData!: LayoutData

  // use deep equality from lodash
  constructor(
    private layoutManager: LayoutManagerService
  ) { }

  isLayoutInDb(layoutData: LayoutData): boolean{
    this.layoutDataFromDb 
      = this.layoutManager.layoutDataTabFromDb
          .filter(element => element.key == layoutData.key)
          .at(0)!;

    this.layoutData = layoutData;

    for (const [layoutDataFromDbKey, layoutDataFromDbValue] of Object.entries(this.layoutDataFromDb)) {
      for (const [layoutDataKey, layoutDataValue] of Object.entries(this.layoutData)) {
          if (layoutDataFromDbKey == layoutDataKey) {
              for(const [layoutDataFromDbValueKey, layoutDataFromDbValueValue] of Object.entries(layoutDataFromDbValue)){
                for(const [layoutDataValueKey, layoutDataValueValue] of Object.entries(layoutDataValue)){
                  if(layoutDataValueKey == layoutDataFromDbValueKey){
                    const layoutDataFinalValue = layoutDataValueValue;
                    const layoutDataFromDBFinalValue = layoutDataFromDbValueValue;
                    if(layoutDataFinalValue != layoutDataFromDBFinalValue) return false;
                  }
                }
              }
          }
      }
  }

    return true;
  }
}
