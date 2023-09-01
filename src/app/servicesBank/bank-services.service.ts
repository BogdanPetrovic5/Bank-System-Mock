import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class BankServicesService {

  constructor(private http: HttpClient) { }

  //Api call for transactions
  getAllTransactions(userID:String):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/Transactions")
  }
  //Api call to change data for receiver
  makeChangesToReceiver(userID:string, currentMoney:number):Observable<any>{
    
    return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
      rsdMoney:currentMoney
    })
  }
  //Api call for getting data of desired user
  getPersonalData(userID:string):Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User/" + userID)
  }
  //Api call to make changes to sender
  makeChangesToSender(userID:string, value:string, currentMoney:number):Observable<any>{
    
    currentMoney = currentMoney - parseFloat(value)
    return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
      rsdMoney:currentMoney
    })
  }
  //Api to make transaction which is first called when u click pay btton
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
  //Api to change eur to din or otherwise
  exchange(userID:string, eurValue:number,rsdValue:number):Observable<any>{
     return this.http.put<any>(environment.apiUrl + "/User/" + userID,{
        eurMoney:eurValue,
        rsdMoney:rsdValue

     })
  }
  //Getin list of users :/
  getRegisteredUsers():Observable<any>{
    return this.http.get<any>(environment.apiUrl + "/User")
  }
}
