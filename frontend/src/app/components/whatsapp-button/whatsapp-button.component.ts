import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { api } from '../../core/api';

@Component({
  standalone: true,
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class WhatsAppButtonComponent {
  @Input() text!: string;

  to = signal('');
  open = signal(false);
  status = signal<'idle' | 'sending' | 'sent' | 'error'>('idle');
  error = signal<string | null>(null);

  openModal() { this.open.set(true); }
  closeModal() { this.open.set(false); this.status.set('idle'); this.error.set(null); }

  async send() {
    if (!this.to() || this.status() === 'sending') return;
    this.status.set('sending');
    this.error.set(null);
    try {
      await api.sendWhatsApp({ to: this.to(), text: this.text, language_code: localStorage.getItem('fintech_language_code') || 'en' });
      this.status.set('sent');
    } catch (e: any) {
      this.error.set(e?.message || 'Failed to send');
      this.status.set('error');
    }
  }
}