import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatService } from 'src/app/services/chat/chat.service';


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
  userName : string;
  userId : string ;
  constructor(private chatService :ChatService) {}

  ngOnInit(): void {
    this.chatService.Username.subscribe(data => {
     this.userName = data;
     this.chatService.GetUserId(this.userName).subscribe((id)=>{
        this.userId = id;
     })
     this.chatService.viewMessages('ring',data).subscribe((message)=>{
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


    console.log(value);
    this.chatService.sendMessage(this.currentUserId,this.userId,value,0).subscribe((data)=>{
      console.log(data);
      this.chatService.viewMessages('ring',this.userName).subscribe((message)=>{
        this.conversations = message.reverse();
        console.log(this.conversations);
     })
       this.chatService.Message.next('ring');
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
