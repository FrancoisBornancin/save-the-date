import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title: string = 'save-the-date'
  i!: number;

  iList: number[] = [];

  doStuff(i: number){
    console.log("++++++++++++++++++++++++++")
    this.i++;
    this.iList.push(i);
    console.log("---------------------")
  }
}
