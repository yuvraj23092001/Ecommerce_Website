import { Component, HostListener, NgModule, ViewChild  ,ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
  
  // function to get how long ago message was sent
  recentChatDate(date: Date): string {
    const recievedDate = new Date(date)
    const today = new Date();
    let curDate = recievedDate.getDate();
    let curMonth = recievedDate.getMonth();
    let curYear = recievedDate.getFullYear()
    if (
      curDate === today.getDate() &&
      curMonth === today.getMonth() &&
      curYear === today.getFullYear()
    ) {
      // Date is same as today, return time
      const hours = recievedDate.getHours().toString().padStart(2, '0');
      const minutes = recievedDate.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      // Date is different from today, return full date
      return `${curDate}/${curMonth}/${curYear}`;
    }
  }
  
  search(term: Event): void {
    const event = (term.target as HTMLInputElement).value;
    this.searchTerms.next(event);
    console.log(event);
  }

}
