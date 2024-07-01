import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { HomeComponent } from './pages/body/home/home.component';
import { TestComponent } from './pages/body/test/test.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { ProgramComponent } from './pages/body/program/program.component';
import { BaseBodyComponent } from './pages/body/base-body/base-body.component';
import { AdminComponent } from './pages/body/admin/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TestComponent,
    HeaderComponent,
    FooterComponent,
    ProgramComponent,
    BaseBodyComponent,
    AdminComponent
  ],
  imports: [
    ButtonModule,
    ColorPickerModule,
    KnobModule,
    DropdownModule,
    InputTextModule,
    EditorModule,
    SplitButtonModule,
    FileUploadModule,
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
