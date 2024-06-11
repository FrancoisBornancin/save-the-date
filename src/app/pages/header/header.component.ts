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

  returnHome(){
    this.router.navigate(['home']);
  }

  returnProgram(){
    this.router.navigate(['program']);
  }

  returnTest(){
    this.router.navigate(['test']);
  }
}
