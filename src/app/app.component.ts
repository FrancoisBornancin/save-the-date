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

  constructor(
    private layoutManager: LayoutManagerService,
    private gitManager: GitManagerService,
  ){

  }

  ngOnInit(): void {
    this.layoutManager.loadData()
    .subscribe({
      next: (response: any) => {
        this.gitManager.sha = response.sha;
        this.layoutManager.layoutDataTab = this.gitManager.getResponseContent(response);
        this.layoutManager.layoutData = 
          this.layoutManager.layoutDataTab
            .filter(layoutData => layoutData.key == 1)
            [0];
        this.color = this.layoutManager.layoutData.backgroundColor;
      },
      error: e => {
        console.log(e);
      },
    });
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

  loadLayoutData(index: number){
    this.layoutManager.layoutData =
      this.layoutManager.layoutDataTab
        .filter(layoutData => layoutData.key == index)
        [0]
        ;
    this.color = this.layoutManager.layoutData.backgroundColor;
    console.log("");
  }

  // setColor(color: string){
  //   this.color = color
  //   this.layoutManager.layoutData.backgroundColor = color;
  // }

  save(){
    this.layoutManager.saveData();
  }
}
