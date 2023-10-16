import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BaseComponent } from './views/layout/base/base.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { NavbarComponent } from './views/layout/navbar/navbar.component';
import { SidebarComponent } from './views/layout/sidebar/sidebar.component';
import { ChatComponent } from './views/layout/chat/chat.component';
import { ChatService } from './services/chat/chat.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HomeComponent,

    BaseComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ChatComponent,
    
 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientApp';
  // conversation :string = null;
  // Messages: string[] = [];
  
  // private subscription: Subscription;

  // constructor(private chatService: ChatService) {
  //   this.subscription = this.chatService.Username.subscribe((message) => {
      
  //     this.conversation = "True";
  //   });
  // }

  // ngOnDestroy() {
  //   // Unsubscribe to avoid memory leaks
  //   this.subscription.unsubscribe();
  // }


  
}
