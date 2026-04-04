import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LANGUAGES, STORAGE_KEYS } from '../../core/languages';

@Component({
  standalone: true,
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  imports: [CommonModule]
})
export class LanguageSelectorComponent {
  languages = LANGUAGES;

  selected = signal(
    (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.languageCode)) || 'en'
  );

  selectedLabel = computed(() =>
    this.languages.find(l => l.code === this.selected())?.label ?? 'English'
  );

  choose(code: string) {
    this.selected.set(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.languageCode, code);
    }
  }
}