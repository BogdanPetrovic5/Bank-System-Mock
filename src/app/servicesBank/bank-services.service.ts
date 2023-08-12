import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BankServicesService {

  constructor(private http: HttpClient) { }
  getUserAccountNumberAndMoney(userID:String):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User/" + userID)
  }
  getUserAccountNumber(userID:String):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User/" + userID)
  }
  getAllTransactions(userID:String):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/Transactions")
  }
}
