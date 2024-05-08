import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GitManagerService } from './services/git-manager/git-manager.service';
import { TokenManagerService } from './services/token-manager/token-manager.service';
import { LayoutManagerService } from './services/layout-manager/layout-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  color!: string;
  testColor: string = 'green';
  dropdownTab!: number[];
  selectedIndex!: number;

  constructor(
    public layoutManager: LayoutManagerService,
    private gitManager: GitManagerService,
  ){

  }

  ngOnInit(): void {
    this.layoutManager.loadData()
    .subscribe({
      next: (response: any) => {
        this.gitManager.sha = response.sha;
        this.layoutManager.layoutDataTabFromDb = this.gitManager.getResponseContent(response);
        this.layoutManager.layoutDataTabCurrent = this.gitManager.getResponseContent(response);
        this.loadLayoutData(1);
        this.setDropdown();
      },
      error: e => {
        console.log(e);
      },
    });
  }

  setDropdown(){
    this.dropdownTab = 
     this.layoutManager.layoutDataTabFromDb
      .map(element => element.key)
      .sort((a, b) => (a - b))
      ;
  }

  getStyle(): string{
    this.setLayoutData();


    let realColor: string;
    if(this.color == undefined) realColor = 'blue';
    else realColor = this.color
    return 'background-color: ' + realColor + '; height: 100%;'
  }

  setLayoutData(){
    this.layoutManager.layoutData.backgroundColor = this.color;
  }

  loadLayoutDataDropdown(event: any){
    this.layoutManager.layoutDataTabCurrent =
      this.layoutManager.layoutDataTabCurrent
        .filter(element => element.key != this.layoutManager.layoutData.key)
        ;

    this.layoutManager.layoutDataTabCurrent.push(this.layoutManager.layoutData);

    this.loadLayoutData(event.value)
  }

  loadLayoutData(index: number){
    this.selectedIndex = index;
    this.layoutManager.layoutData =
      this.layoutManager.layoutDataTabCurrent
        .filter(layoutData => layoutData.key == index)
        [0]
        ;
    this.layoutManager.layoutData.hasBeenSaved = '';
    this.color = this.layoutManager.layoutData.backgroundColor;
  }

  save(){
    this.layoutManager.saveData(this.selectedIndex);
  }
}
