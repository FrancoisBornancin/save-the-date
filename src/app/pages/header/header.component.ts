import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    private router: Router
  ){

  }

  headerTab: string[] = ['home', "program", "test"]

  returnPage(pageName: string){
    this.router.navigate([pageName]);
  }
}
