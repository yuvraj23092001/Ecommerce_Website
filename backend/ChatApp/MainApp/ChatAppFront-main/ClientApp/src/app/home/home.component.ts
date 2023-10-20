import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../views/layout/sidebar/sidebar.component';
import { ChatComponent } from '../views/layout/chat/chat.component';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SidebarComponent, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  conversation :boolean = false;
  Messages: string[] = [];
  conversations = [
  ];
  currentUserId :any ;
  currentUserName : any;
  otheruserName : string;
  imageFile: File;
  
  private subscription: Subscription;

  constructor(private chatService: ChatService, private authService: AuthService) {
    this.subscription = this.chatService.Username.subscribe((message) => {
      
      this.conversation = true;
    });
  }

  
  ngOnInit(): void {
    this.authService.user().subscribe((username) => {
      this.currentUserName = username;
    })
    
    this.currentUserName = this.currentUserName || this.authService.getUser();
     console.log(this.currentUserName);

    this.chatService.GetUserId(this.currentUserName).subscribe((id)=>{
      this.currentUserId = id;      
   })
   

    this.chatService.Username.subscribe(data => {
      // console.log("insid")
     this.otheruserName = data;
     this.chatService.viewMessages(this.currentUserName,data).subscribe((message)=>{
        this.conversations = message.reverse();
        console.log(this.conversations);
     }, (error) => {
      console.log("ff ",error)
     })
    })
 }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
}
