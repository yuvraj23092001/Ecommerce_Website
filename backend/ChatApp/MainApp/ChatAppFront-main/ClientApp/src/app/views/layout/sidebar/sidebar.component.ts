import { Component, HostListener, NgModule, ViewChild  ,ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(private modalService: NgbModal, private chatService: ChatService) { }
  // @ViewChild('basicModal') basicModal: any;

  profileImageUrl = '../../assets/images/noPic.svg';
  private searchTerms = new Subject<string>();
  results : any[] ;
  isDropdownOpen = false;
  conversations = [] ;

  ngOnInit() : void{
     // Load the users who i have chatted before 
     this.chatService.RecentMessages('ring').subscribe((data)=>{
        this.conversations = data;
        console.log(data);
     });

     this.chatService.Message.subscribe((data)=>{
         this.chatService.RecentMessages(data).subscribe((recent)=>{
            this.conversations = recent;
         })
     })

     this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged()
     ).subscribe(term =>{
      if (term === ""){
         this.chatService.RecentMessages('ring').subscribe(data => {
          this.conversations = data;
         })  
      }
      this.chatService.SearchOthers('ring',term).subscribe(data =>{
          this.conversations = data ;
          
      });
      
     })
  }
  
  recentChatDate(date :Date){
    return this.chatService.recentChatDate(date);
  }

  openBasicModal(content: any) {
    this.modalService.open(content, {}).result.then((result) => {
    }).catch((res) => { });
  }

  onClick(Username: string) {
    this.chatService.Username.next(Username);
    console.log(Username);
    this.chatService.viewMessages('string', Username).subscribe((res) => {
      console.log(res);
    },
      (err) => { console.log(err); });

  }
  
  
  
  search(term: Event): void {
    const event = (term.target as HTMLInputElement).value;
    this.searchTerms.next(event);
    console.log(event);
  }

}
