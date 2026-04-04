import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home/home.component';
import { AboutPageComponent } from './pages/about/about.component';
import { ChatPageComponent } from './pages/chat/chat.component';
import { ReportPageComponent } from './pages/report/report.component';
import { ScamsPageComponent } from './pages/scams/scams.component';

@NgModule({
  declarations: [],  // ← empty
  imports: [
    BrowserModule,
    AppRoutingModule,
    // Move all standalone components here:
    AppComponent,
    HomePageComponent,
    AboutPageComponent,
    ChatPageComponent,
    ReportPageComponent,
    ScamsPageComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }