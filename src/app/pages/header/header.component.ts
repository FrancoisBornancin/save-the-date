import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminManagerService } from '../../services/admin-manager/admin-manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  pageName!: string;

  constructor(
    public adminManager: AdminManagerService,
    private router: Router
  ){
    
  }

  ngOnInit(): void {
    this.adminManager.eventEmitter
    .subscribe({
      next: (results: any) => {
        const toto = results;
        this.adminManager.isPreviewActive = results;
        console.log("");
      },
      error: (error: any) => {
        const tata = error;
        console.error("");
      }
    });
    console.log("");
  }

  headerTab: string[] = ['home', "program", "test", "admin"]

  returnPage(pageName: string){
    this.pageName = pageName;
    this.router.navigate([pageName]);
  }
}
