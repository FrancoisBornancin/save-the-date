import { Injectable } from '@angular/core';
import { LayoutData } from '../../model/layout-data/layout-data';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutDaoService {
  layoutDataFromDb!: LayoutData
  layoutData!: LayoutData

  constructor(
    private layoutManager: LayoutManagerService,
  ) { }

  isLayoutInDb(): boolean{
    this.layoutDataFromDb 
      = this.layoutManager.layoutDataTabFromDb
          .filter(element => element.key == this.layoutManager.layoutData.key)
          .at(0)!;

    this.layoutData = this.layoutManager.layoutData;

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
