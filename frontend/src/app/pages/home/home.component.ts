import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScamTickerComponent } from '../../components/scam-ticker/scam-ticker.component';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';

@Component({
  standalone: true,
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    NavbarComponent,
    ScamTickerComponent,
    LanguageSelectorComponent
  ]
})
export class HomePageComponent {}