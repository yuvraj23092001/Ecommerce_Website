import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { BaseComponent } from './views/layout/base/base.component';
import { FooterComponent } from './views/layout/footer/footer.component';
import { NavbarComponent } from './views/layout/navbar/navbar.component';
import { SidebarComponent } from './views/layout/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    HomeComponent,
    NavMenuComponent,
    BaseComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent

  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientApp';
}
