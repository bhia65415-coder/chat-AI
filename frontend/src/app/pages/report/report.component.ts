import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScamTickerComponent } from '../../components/scam-ticker/scam-ticker.component';

@Component({
  standalone: true,
  selector: 'app-report-page',
  templateUrl: './report.component.html',
  imports: [
    CommonModule,
    NavbarComponent,
    ScamTickerComponent
  ]
})
export class ReportPageComponent {}