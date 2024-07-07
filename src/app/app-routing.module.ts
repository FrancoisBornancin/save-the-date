import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/body/home/home.component';
import { TransportComponent } from './pages/body/transport/transport.component';
import { ProgramComponent } from './pages/body/program/program.component';
import { AdminComponent } from './pages/body/admin/admin/admin.component';
import { AccomodationComponent } from './pages/body/accomodation/accomodation/accomodation.component';

const routes: Routes = [
  { path: 'acceuil', component: HomeComponent },
  { path: 'programme', component: ProgramComponent },
  { path: 'transport', component: TransportComponent },
  { path: 'hébergement', component: AccomodationComponent },
  { path: 'réponse', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
