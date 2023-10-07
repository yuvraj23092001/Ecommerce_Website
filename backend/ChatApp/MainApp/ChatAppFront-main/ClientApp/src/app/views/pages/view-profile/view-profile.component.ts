import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ViewProfile } from 'src/app/interfaces/view-profile';
@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  
  constructor(private service:AuthService){

  }
  username : string = "ring";
  profile : ViewProfile = {
    firstName: "",
    lastName: "",
    email: "",
    imagePath : null,
    userName : ""
  } ;
  imageSource : string = "";
   ngOnInit(){

     

     this.service.viewProfile(this.username).subscribe({
        next: (data) => {
           this.profile = data;
          this.imageSource = "data:image/jpeg;base64," + data.imagePath;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  
  
}
