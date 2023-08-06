import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  constructor(private http: HttpClient) { }
  register(username:string, password:string, cardNumber:string, email:string)
  {
    return this.http.post<any>(environment.apiUrl + "/User", {
      username:username,
      password:password,
      cardNumber:cardNumber,
      email:email
    });
  }
}
