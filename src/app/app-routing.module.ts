import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/body/home/home.component';
import { TestComponent } from './pages/body/test/test.component';
import { ProgramComponent } from './pages/body/program/program.component';
import { AdminComponent } from './pages/body/admin/admin/admin.component';

const routes: Routes = [
  { path: 'accueil', component: HomeComponent },
  { path: 'programme', component: ProgramComponent },
  { path: 'transport', component: TestComponent },
  { path: 'réponse', component: AdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
