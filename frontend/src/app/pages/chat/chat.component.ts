import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ScamTickerComponent } from '../../components/scam-ticker/scam-ticker.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';

@Component({
  standalone: true,
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  imports: [
    CommonModule,
    NavbarComponent,
    ScamTickerComponent,
    ChatWindowComponent
  ]
})
export class ChatPageComponent {}