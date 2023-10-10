import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,NgbModule,FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private modalService: NgbModal, private chatService :ChatService) {}
  // @ViewChild('basicModal') basicModal: any;
  
   profileImageUrl = '../../assets/images/noPic.svg';
   searchText: string;
 
  conversations = [
    {name: "ring", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false, },
    {name: "James", time:"8:21", latestMessage: "Good Morning!" ,  latestMessageRead: true},
    {name: "Andrew", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Richard", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: true},
    {name: "Dyno", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Julie", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Tom", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: true},
    {name: "Jerry", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Grey", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Jill", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: true},
    {name: "Blue", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "King", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: false},
    {name: "Kong", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: true},
    {name: "Rock", time:"8:21", latestMessage: "Good Morning!" , latestMessageRead: true},
   
  ]

  openBasicModal(content: any) {
    this.modalService.open(content, {}).result.then((result) => {
    }).catch((res) => {});
  }

  onClick(Username :string){
       this.chatService.Username.next(Username);
       console.log(Username);
       this.chatService.viewMessages('string', Username).subscribe((res) => {
        console.log(res);
       },
       (err) => {console.log(err);});
       
  }
  
  get filteredConversations() {
    return this.conversations.filter((conversation) => {
      return (
        conversation.name
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        conversation.latestMessage
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      );
    });
  }

}
