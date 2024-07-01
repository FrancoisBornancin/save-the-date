import { Component } from '@angular/core';
import { AdminManagerService } from '../../../../services/admin-manager/admin-manager.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(public adminManager: AdminManagerService){

  }
}
