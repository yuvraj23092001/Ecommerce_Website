import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Message } from 'src/app/models/message.model';
import { DomSanitizer } from '@angular/platform-browser';
import { SignalrService } from 'src/app/services/signalr/signalr.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,PickerModule,NgbModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  localPath : string = "http://localhost:5050/";
  showEmoji : boolean = false;
  emojiPickerVisible = false;
  message = '';
  IsReplying :boolean = false;
  messageInput : Message ={
    senderId : 0,
    receiverId : 0,
    content : '',
    isSeen : false,
    dateTime : new Date(),
    type : '',
    replyedToId: 0,
    isReply : false
  } ;
  imageSrc: string | ArrayBuffer;
  @Output() dataEmitter: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Input() conversations = [];
  @Input() currentUserId :any ;
  @Input() currentUserName : any;
  @Input() otheruserName : string;
  

  userId : string ;
  imageFile: File;
  fileType: string;
  constructor(private chatService :ChatService, private authService : AuthService,private modalService : NgbModal, private sanitizer: DomSanitizer, private signalRService : SignalrService) {
    
  }
  
  ngOnInit(){
      console.log(this.otheruserName);
      console.log("fsda f af " , this.currentUserName);
      this.chatService.GetUserId(this.otheruserName).subscribe((userId)=>{
         this.userId = userId;
      })

      this.signalRService.hubConnection.on('recieveMessage',(msg: Message)=>{
        console.log(msg);
        this.conversations.push(msg);
      
      })
  }

 Emoji(event, message :any){
  
  const text = message.value + event.emoji.native;
  message.value = text;
  this.showEmoji = false;
}

toggleEmoji(message :any){
  this.showEmoji = !this.showEmoji;
}

  submitMessage(event) {
    // getting content from the textarea 
    let value = event.target.value.trim();
    this.message = '';
    if (value.length < 1) return false;
    this.CloseRplyMsg();
    // check if the message is a reply or not . 
    console.log(this.messageInput.replyedToId);
    if(this.messageInput.replyedToId == 0){

      this.signalRService.hubConnection.invoke('sendMsg',this.message).catch((error)=>console.log(error));

    //   this.chatService.sendMessage(this.currentUserId,this.userId,value,0,'Null').subscribe((data)=>{
    //     this.chatService.Message.next(this.currentUserName);
    //     this.dataEmitter.emit([value,this.userId]);
    //  });
    }
    else{

      console.log(this.messageInput.replyedToId);
      this.chatService.sendReplyMessage(value,this.currentUserId,this.userId,'Null',this.messageInput.replyedToId,this.messageInput.replyedToId).subscribe((data)=>{
        console.log(data);
        this.chatService.Message.next(this.currentUserName);
        this.dataEmitter.emit([value,this.userId,this.messageInput.replyedToId]);
      });

    }
    

    

    return true;
  }

  emojiClicked(event) {
    this.message += event.emoji.native;
  }
  
  // getContent(messageId : number){
  //    this.chatService.getContent(messageId).subscribe((data)=>{
  //       return data;
  //    })
     
  // }

  recentChatDate(date :Date){
    return this.chatService.recentChatDate(date);
  }
  
  
  openBasicModal(content) {
    this.modalService.open(content, {}).result.then((result) => {
    }).catch((res) => {});
  }

  onFileSelected(event){
    if (event.target.files.length > 0) {
      this.imageFile = (event.target as HTMLInputElement).files[0];
      this.previewImage(this.imageFile);
    }
  }
  
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageSrc = e.target.result;
    };
    // Read the file as a data URL, triggering the onload event above
    reader.readAsDataURL(file);
    this.fileType = file.type;
  }
  isImage(type: string): boolean {
    return type.startsWith('image/');
  }

  isAudio(type: string): boolean {
    return type.startsWith('audio/');
  }

  isVideo(type: string): boolean {
    return type.startsWith('video/');
  }
  removePreview(){
    this.imageSrc = null;
  }

  uploadFile(){
    console.log('Sending.....');
    const formdata = new FormData();
    formdata.append('File',this.imageFile),
    formdata.append('SenderId',this.userId),
    formdata.append('ReceiverId',this.currentUserId),
    formdata.append('Content','this is not shown to user'),
    formdata.append('ReplyedToId','0'),
    formdata.append('Type','Any');
    this.chatService.sendFileMessages(formdata).subscribe((data)=>{
      console.log(data);
    })
    
  }

  // Implement the logic for replying to a message.
  ToggleReplyMsg(msg:any){
     console.log(msg);
     console.log("event fired");
     this.messageInput.replyedToId = msg.id;
     this.messageInput.isReply = true;
     this.messageInput.content = msg.content;
     this.IsReplying = true;
     console.log(this.messageInput);
  }

  CloseRplyMsg(){
    this.IsReplying = false;
  }
}
