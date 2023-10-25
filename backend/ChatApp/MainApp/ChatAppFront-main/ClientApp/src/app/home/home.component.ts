import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat/chat.service';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../views/layout/sidebar/sidebar.component';
import { ChatComponent } from '../views/layout/chat/chat.component';
import { AuthService } from '../services/auth/auth.service';
import { SignalrService } from '../services/signalr/signalr.service';
import { Message } from '../models/message.model';

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

  constructor(private chatService: ChatService, private authService: AuthService,private signalRService : SignalrService ) {
    console.log("this is done", this.currentUserName);
    
    this.subscription = this.chatService.Username.subscribe((message) => {
      
      this.conversation = true;
    });
  }

  
  ngOnInit(): void {
    
     

     this.currentUserName = localStorage.getItem('username');
     console.log(this.currentUserName);
      // Initializing signalr
     this.signalRService.startConnection(this.currentUserName);

    this.chatService.GetUserId(this.currentUserName).subscribe((id)=>{
      this.currentUserId = id;      
    })
    
    // this.signalRService.hubConnection.on('recieveMessage',(msg: Message)=>{
        
    // })

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

 
  
  handleData(data: any[]) {
       console.log(data);

       this.conversations = [
        {
          content: data[0],
          senderId: this.currentUserId,
          recieverId: data[1],
          dateTime: Date.now(),
          isReply: false,
          isSeen: false,
          replyedToId: 0,
          type: 'Null'
        },
        ...this.conversations
      ];
      
       console.log("ggg ", this.conversations);
  }
  
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.subscription.unsubscribe();
  }
}
