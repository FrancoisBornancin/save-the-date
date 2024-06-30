import { Component, OnInit } from '@angular/core';
import { CommonFacadeService } from '../../../services/common-facade/common-facade.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss'
})
export class ProgramComponent{
  constructor(
    public commonFacade: CommonFacadeService,
  ){
    this.commonFacade.imageFolder = 'repository/program-images-repository';
    this.commonFacade.layoutJsonName = 'json-layout/page-component-layout.json';
  } 

}
