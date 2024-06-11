import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/body/home/home.component';
import { TestComponent } from './pages/body/test/test.component';
import { ProgramComponent } from './pages/body/program/program.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'program', component: ProgramComponent },
  { path: 'test', component: TestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
