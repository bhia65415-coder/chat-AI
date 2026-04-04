import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScamTickerComponent } from '../../components/scam-ticker/scam-ticker.component';
import { FraudSeverityBadgeComponent } from '../../components/fraud-severity-badge/fraud-severity-badge.component';
import { api, ScamAlert } from '../../core/api';

@Component({
  standalone: true,
  selector: 'app-scams-page',
  templateUrl: './scams.component.html',
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ScamTickerComponent,
    FraudSeverityBadgeComponent
  ]
})
export class ScamsPageComponent implements OnInit {
  items = signal<ScamAlert[]>([]);
  stateInput = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  title = computed(() => {
    return this.stateInput() ? `Live Scam Alerts — ${this.stateInput()}` : "Trending Scams in India Today";
  });

  ngOnInit() {
    this.load();
  }

  onStateChange(val: string) {
    this.stateInput.set(val);
    this.load();
  }

  async load() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = this.stateInput() ? await api.scamsByState(this.stateInput()) : await api.trendingScams();
      this.items.set(res.items || []);
    } catch (e: any) {
      this.error.set(e?.message || "Failed");
    } finally {
      this.loading.set(false);
    }
  }
}