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
    private layoutManager: LayoutManagerService
  ){

  }

  ngOnInit(): void {
    // this.layoutManager.getColor();
    // this.testColor = this.layoutManager.color;
    console.log("");
  }

  getStyle(): string{
    return 'background-color: ' + this.testColor + '; height: 100%;'
  }

  getColorFromGit() {
    this.layoutManager.getColor();
    console.log("");
  }

  pushToGitNewColor(newColor: string) {
    this.layoutManager.setColor(newColor);
    console.log("");
  }
}
