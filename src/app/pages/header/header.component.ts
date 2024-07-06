import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminManagerService } from '../../services/admin-manager/admin-manager.service';
import { KeyValues } from '../../model/keyValues';
import { LayoutManagerService } from '../../services/layout-manager/layout-manager.service';
import { ColorConvertorService } from '../../services/color-to-rgba/color-convertor.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  pageName!: string;
  headerTab: KeyValues[] = [
    {key: 'acceuil', value: 'pi pi-user'},
    {key: 'programme', value: 'pi pi-book'},
    {key: 'transport', value: 'pi pi-car'},
    {key: 'hébergement', value: 'pi pi-building-columns'},
    {key: 'réponse', value: 'pi pi-address-book'},
  ]

  constructor(
    public adminManager: AdminManagerService,
    public layoutManager: LayoutManagerService,
    private colorConvertor: ColorConvertorService,
    private domSanitizer: DomSanitizer,
    private router: Router
  ){
    
  }

  reworkTextValue(): SafeHtml{
    const textReworked = this.layoutManager.textValue.split('class="ql-align-center"')
                        .join('style="text-align: center;"');

    return this.domSanitizer.bypassSecurityTrustHtml(
      textReworked
    );
  }

  ngOnInit(): void {
    this.adminManager.eventEmitter
    .subscribe({
      next: (results: any) => {
        this.adminManager.isPreviewActive = results;
        console.log("");
      },
      error: (error: any) => {
        console.error("");
      }
    });
    console.log("");
  }

  getTitles(): string[]{
    return this.headerTab
        .map(element => element.key)
  }

  getButtonClass(buttonTitle: string){

    return this.headerTab
      .filter(header => header.key == buttonTitle)
      .map(header => header.value)
      .at(0)!
  }

  getButtonStyle(){
    return {
      'color': this.layoutManager.textColor, 
    }
  }

  globalHeaderStyle(){
    const backgroundColorValue = 
    this.colorConvertor.addOpacity(
      this.colorConvertor.convertToRgba(this.layoutManager.textColor),
      (this.layoutManager.backgroundOpacity/100)
     )

    return {
      'height': '30%',
      'background-color': backgroundColorValue,
    };    
  }


  buttonsClass(){
    const buttonWidth = (100/this.headerTab.length); 
    return {
      'width': buttonWidth + '%', 
      'height': '30%',
      'background-color': 'transparent',
    };
  }

  textStyle(){
    return 'color: ' + this.layoutManager.textColor + ";"
          + 'font-size: ' + this.layoutManager.textSize + "px;"
          + 'font-family: "Playwrite ' + this.layoutManager.textPolice + '", cursive;'
          + "height: 70%;"
          + "text-align: center;"
          + "padding: 40px"
  }

  returnPage(pageName: string){
    this.pageName = pageName;
    this.router.navigate([pageName]);
  }
}
