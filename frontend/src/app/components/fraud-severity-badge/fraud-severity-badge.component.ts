import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const BADGES: Record<string, { cls: string; dot: string; label: string }> = {
  high:   { cls: 'bg-red-100 border-red-400 text-red-700',    dot: '🔴', label: 'High Risk' },
  medium: { cls: 'bg-yellow-100 border-yellow-400 text-yellow-700', dot: '🟡', label: 'Medium Risk' },
  low:    { cls: 'bg-green-100 border-green-400 text-green-700',  dot: '🟢', label: 'Low Risk' },
};

@Component({
  standalone: true,
  selector: 'app-fraud-severity-badge',
  templateUrl: './fraud-severity-badge.component.html',
  styleUrls: ['./fraud-severity-badge.component.scss'],
  imports: [CommonModule]
})
export class FraudSeverityBadgeComponent {
  @Input() severity!: string;

  currentBadge() {
    return BADGES[this.severity?.toLowerCase()] ?? { cls: 'bg-gray-100 border-gray-400 text-gray-700', dot: '⚪', label: 'Unknown' };
  }
}