import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminManagerService } from '../../services/admin-manager/admin-manager.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(
    public adminManager: AdminManagerService,
    private router: Router
  ){

  }

  headerTab: string[] = ['home', "program", "test"]

  returnPage(pageName: string){
    this.router.navigate([pageName]);
  }
}
