import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FraudSeverityBadgeComponent } from '../fraud-severity-badge/fraud-severity-badge.component';
import { WhatsAppButtonComponent } from '../whatsapp-button/whatsapp-button.component';
import { api, ChatResponse } from '../../core/api';
import { STORAGE_KEYS } from '../../core/languages';

type Msg = { role: 'user' | 'assistant'; content: string; payload?: ChatResponse };

@Component({
  standalone: true,
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    FraudSeverityBadgeComponent,
    WhatsAppButtonComponent
  ]
})
export class ChatWindowComponent implements OnInit {
  @ViewChild('bottomRef') bottomRef!: ElementRef;

  input = signal('');
  loading = signal(false);
  messages = signal<Msg[]>([]);

  get languageCode() {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(STORAGE_KEYS.languageCode) || 'en';
  }

  get sessionId() {
    if (typeof window === 'undefined') return undefined;
    const key = 'fintech_ai_session_id';
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(key, id);
    return id;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  ngOnInit() {}

  async send() {
    const text = this.input().trim();
    if (!text || this.loading()) return;

    this.input.set('');
    this.loading.set(true);
    this.messages.update(m => [...m, { role: 'user', content: text }]);
    this.scrollToBottom();

    try {
      const res = await api.chat({ message: text, language_code: this.languageCode, session_id: this.sessionId });
      this.messages.update(m => [...m, { role: 'assistant', content: res.answer, payload: res }]);
    } catch (e: any) {
      const msg = e?.message || 'Something went wrong';
      this.messages.update(m => [
        ...m,
        {
          role: 'assistant',
          content: `Sorry — I couldn't reach the Fintech.AI backend.\n\nDetails: ${msg}\n\nCybercrime Helpline: 1930 | Report at: cybercrime.gov.in`
        }
      ]);
    } finally {
      this.loading.set(false);
      this.scrollToBottom();
    }
  }
}