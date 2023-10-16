import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,PickerModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  
  emojiPickerVisible = false;
  message = '';
  conversations = [
  ];
  currentUserId :any = 1;
  currentUserName : any;
  otheruserName : string;
  userId : string ;
  constructor(private chatService :ChatService, private authService : AuthService) {}

  ngOnInit(): void {
    this.authService.user().subscribe((username) => {
      this.currentUserName = username;
    })
    
    this.currentUserName = this.authService.getUser();
    //  console.log(this.currentUserName);

    this.chatService.GetUserId(this.currentUserName).subscribe((id)=>{
      this.currentUserId = id;
      //  console.log(this.currentUserId);
   })
   
   
    this.chatService.Username.subscribe(data => {
     this.otheruserName = data;
     this.chatService.GetUserId(this.otheruserName).subscribe((id)=>{
        this.userId = id;
     })
     this.chatService.viewMessages(this.currentUserName,data).subscribe((message)=>{
        this.conversations = message.reverse();
        console.log(this.conversations);
     })
    })
 }
  
  submitMessage(event) {
    // getting content from the textarea 
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    console.log("hei");
    console.log(this.currentUserId);
    console.log(this.currentUserName);
    console.log(this.otheruserName);

    console.log(value);
    
    this.chatService.sendMessage(this.currentUserId,this.userId,value,0).subscribe((data)=>{
      // console.log(data);
      // this.chatService.viewMessages(this.currentUserName,this.otheruserName).subscribe((message)=>{
      //   this.conversations = message.reverse();
      //   console.log(this.conversations);
    //  })
       this.chatService.Message.next(this.currentUserName);
    });
    

    

    return true;
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }

  recentChatDate(date :Date){
    return this.chatService.recentChatDate(date);
  }

}
