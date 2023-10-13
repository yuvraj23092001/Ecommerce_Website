import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditProfile } from 'src/app/models/edit-profile';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {
  loggedInUser : EditProfile = {
    FirstName : "",
    LastName : "",
    UserName : "",
    Email : "", 
    ProfileImage : null
  };
  
  changepassword : {old:string,newp:string,verify:string} = {
    old:"",newp:"",verify:""
  };
  constructor( private service :AuthService, private modalService: NgbModal) { }

  ngOnInit(): void {
    
    this.service.viewProfile("ring").subscribe()

    this.changepassword={
      newp: '',
      old: '',
      verify:''
    };
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.loggedInUser.ProfileImage = (event.target as HTMLInputElement).files[0];
      console.log(this.loggedInUser.ProfileImage);
    }
  }

  onSubmit(){
    const formdata = new FormData();
    formdata.append('username',this.loggedInUser.UserName);
    formdata.append('firstName' ,this.loggedInUser.FirstName);
    formdata.append('lastName' ,this.loggedInUser.LastName);
    formdata.append('email' ,this.loggedInUser.Email);
    formdata.append('profileImage',this.loggedInUser.ProfileImage);
    
  }

  change(){
    
  }

  openBasicModal(content: any) {
    this.changepassword.newp='';
    this.changepassword.old='';
    this.changepassword.verify='';
    this.modalService.open(content, {}).result.then((result) => {
    }).catch((res) => {});
  }
}
