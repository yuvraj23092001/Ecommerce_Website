import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ViewProfile } from '../../models/view-profile';
import { EditProfile } from '../../models/edit-profile';
import { Login } from 'src/app/models/login.model';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string ="http://localhost:5050/api/Account"
  private showToolbar: boolean = true ;
  $user = new BehaviorSubject<any | undefined>(undefined);
  setShowToolbar(show : boolean): void {
    this.showToolbar =show;
  }
    
  getShowToolbar(): boolean{
    return this.showToolbar;
  }

  constructor(private http : HttpClient, private router:Router, private cookieService: CookieService) { }
  

  signUp(userObj:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/Register`,userObj);
  }
  
  login(loginObj:any):Observable<Login>{
    return this.http.post<Login>(`${this.baseUrl}/Login`,loginObj);
  }
  
  viewProfile(profileObj : string):Observable<ViewProfile>{
    return this.http.get<any>(`${this.baseUrl}/get-user?UserName=${profileObj}`);
  }

  editProfile(profileObj : string, updateData :EditProfile){

  }

  setUser(user: any): void{
    // 
    this.$user.next(user);
    localStorage.setItem('username',`${user}`);
  }
  
  user(): Observable<any| undefined>{
    return this.$user.asObservable();
  }
  
  getUser(): any{
    const username = localStorage.getItem('username');
    if(username){
      return username;
    }
    return undefined;
  }

  logout(): void{
    localStorage.clear();
    this.cookieService.delete('Authorization', '/');
    this.router.navigate(['/login']);
    this.$user.next(undefined);
  }

}

