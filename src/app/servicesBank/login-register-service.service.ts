import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginRegisterServiceService {

  constructor(private http: HttpClient) { }
  public userID = ""
  register(username:string, password:string, cardNumber:string, email:string,name:string, lastName:string,rsdAccNum:string,eurAccNum:string, pin:string):Observable<any>
  {
    return this.http.post<any>(environment.apiUrl + "/User", {
      username:username,
      password:password,
      cardNumber:cardNumber,
      email:email,
      name:name,
      lastName:lastName,
      rsdAccountNumber:rsdAccNum,
      eurAccountNumber:eurAccNum,
      pin:Number(pin)
    });
  }

  login():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User")
  }
}
