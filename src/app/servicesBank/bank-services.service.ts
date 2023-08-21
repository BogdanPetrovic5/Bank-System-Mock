import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BankServicesService {

  constructor(private http: HttpClient) { }
  getAllTransactions(userID:String):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/Transactions")
  }
  makeChangesToReceiver(userID:string, currentMoney:number):Observable<any>{
    
    return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
      rsdMoney:currentMoney
    })
  }
  getPersonalData(userID:string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User/" + userID)
  }
  makeChangesToSender(userID:string, value:string, currentMoney:number):Observable<any>{
    
    currentMoney = currentMoney - parseFloat(value)
    return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
      rsdMoney:currentMoney
    })
  }

  makeTransaction(receiverName:string, receiverLastName:string, receiverAccNum:string, value:string,senderName:string, senderLastName:string,senderUsername:string):Observable<any>{
    parseFloat(value)
    return this.http.post<any>(environment.apiUrl + "/Transactions",{
      receiverName:receiverName,
      receiverLastName:receiverLastName,
      senderName:senderName,
      senderLastName:senderLastName,
      receiverAccountNumber:receiverAccNum,
      money:value,
      senderUsername:senderUsername
    })
  }
  exchange(userID:string, eurValue:number,rsdValue:number):Observable<any>{
     return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
        eurMoney:eurValue,
        rsdMoney:rsdValue

     })
  }

  getRegisteredUsers():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User")
  }
}
