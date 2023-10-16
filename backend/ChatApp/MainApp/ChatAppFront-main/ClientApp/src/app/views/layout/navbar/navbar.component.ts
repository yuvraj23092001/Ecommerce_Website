import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,NgbDropdownModule],
  
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  User :any = {
    firstName: "Yuvraj",
    lastName: "Khanna",
    email: "abc@gmail.com",
    imagePath : null
  }

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router,
    private authService : AuthService
  ) { }
  
  ngOnInit(): void {

  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e:any) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e:any) {
    e.preventDefault();
    console.log(" hi ");
    this.authService.logout();
    this.router.navigate['/login'];
  }

  onEdit(e:any){
    e.preventDefault();
    this.router.navigate['/edit-profile'];
  }
}
