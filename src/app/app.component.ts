import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'save-the-date'
  i: number = 0;

  iList: number[] = [];

  doStuff(i: number){
    this.i += 1;
    this.iList.push(i);
    console.log("");
  }
}
