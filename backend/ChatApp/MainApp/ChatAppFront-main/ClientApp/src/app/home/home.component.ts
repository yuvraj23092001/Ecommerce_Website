import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../views/layout/navbar/navbar.component';
import { ChatService } from '../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../views/layout/sidebar/sidebar.component';
import { ChatComponent } from '../views/layout/chat/chat.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,NavbarComponent, SidebarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  conversation :string = null;
  Messages: string[] = [];
  
  private subscription: Subscription;

  constructor(private chatService: ChatService) {
    this.subscription = this.chatService.Username.subscribe((message) => {
      
      this.conversation = "True";
    });
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
}
