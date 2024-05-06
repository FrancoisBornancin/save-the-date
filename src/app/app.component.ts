import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { GitManagerService } from './services/git-manager/git-manager.service';
import { TokenManagerService } from './services/token-manager/token-manager.service';
import { LayoutManagerService } from './services/layout-manager/layout-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  color!: string;
  testColor: string = 'green';

  constructor(
    private gitManager: GitManagerService,
    private layoutManager: LayoutManagerService
  ){

  }

  getStyle(): string{
    return 'background-color: ' + this.testColor + '; height: 100%;'
  }

  pushToGitNewColor(newColor: string) {
    // this.layoutManager.setColor(newColor);
    this.testColor = newColor
  }
}
