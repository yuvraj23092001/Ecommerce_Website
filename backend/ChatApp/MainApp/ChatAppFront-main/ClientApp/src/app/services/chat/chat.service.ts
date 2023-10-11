import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // http://localhost:5050/api/Chat/GetMessages
  private baseUrl:string ="http://localhost:5050/api/Chat";
  public Username = new Subject<string>();
  constructor(private http : HttpClient, private router:Router) { }

  // Get All Messages 
  viewMessages(userObj : string, otherObj:string):Observable<any>{
    console.log(otherObj);
    console.log(`${this.baseUrl}/GetMessages?username=${userObj}&selusername=${otherObj}`)
    return this.http.get<any>(`${this.baseUrl}/GetMessages?username=${userObj}&selusername=${otherObj}`);
  }

  // Search bar 
  SearchOthers(userObj:string,otheruserObj:string){
     return this.http.get<any>(`${this.baseUrl}/SearchOthers?searchname=${otheruserObj}&username=${userObj}`);
  }

  // Recent Messages 
  RecentMessages(userObj:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/RecentMessages`,
    {
      params: {
        userName : userObj
      }
    });
  }
}
