import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ViewProfile } from '../interfaces/view-profile';
import { EditProfile } from '../interfaces/edit-profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl:string ="http://localhost:5050/api/Account"
  private showToolbar: boolean = true ;

  setShowToolbar(show : boolean): void {
    this.showToolbar =show;
  }
    
  getShowToolbar(): boolean{
    return this.showToolbar;
  }

  constructor(private http : HttpClient, private router:Router) { }
  

  signUp(userObj:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/Register`,userObj);
  }
  
  login(loginObj:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/Login`,loginObj);
  }
  
  viewProfile(profileObj : string):Observable<ViewProfile>{
    return this.http.get<any>(`${this.baseUrl}/get-user?UserName=${profileObj}`);
  }

  editProfile(profileObj : string, updateData :EditProfile){

  }
  
//   signUp(userObj:any): Observable<any>{
//     return this.http.post<any>("http://localhost:3000/Register",userObj)
//   }

//   login(loginObj:any):Observable<any>{
//     console.log("gg", loginObj)
//     return this.http.post<any>("http://localhost:3000/User",loginObj)

// }
}

