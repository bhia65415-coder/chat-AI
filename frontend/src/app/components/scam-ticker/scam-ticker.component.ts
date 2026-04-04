import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { api } from '../../core/api';

@Component({
  standalone: true,
  selector: 'app-scam-ticker',
  templateUrl: './scam-ticker.component.html',
  styleUrls: ['./scam-ticker.component.scss'],
  imports: [CommonModule]
})
export class ScamTickerComponent implements OnInit {
  text = signal('Loading latest scam alerts…');

  async ngOnInit() {
    try {
      const res = await api.trendingScams();
      const items = res.items ?? [];
      if (items.length) {
        this.text.set(items.map((i: any) => i.title).join('  •  '));
      }
    } catch {
      this.text.set('Stay alert — report scams at cybercrime.gov.in | Helpline: 1930');
    }
  }
}