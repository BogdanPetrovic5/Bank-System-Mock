import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterLoginComponent } from '../register-login/register-login.component';
import { BankServicesService } from '../servicesBank/bank-services.service';
import { LoginRegisterServiceService } from '../servicesBank/login-register-service.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  public home = true
  public safe = false
  public wallet = false
  public cards = false
  public currencies = false 
  public fullName =""
  public firstName:any
  public lastName:any
  public initials:any

  public rsdAccNum:any
  public eurAccNum:any
  public username:any
  public eurValue = 0
  public rsdValue = 0
  public calc = true
  public homeTab = false;
  public payinsTab = true
  public exchangeTab = false
  public transactions = [{receiverName:"",receiverLastName:"",senderName:"",senderLastName:"", money:0,receiverAccountNumber:"", senderUsername:"", show:false}]
  constructor(private route: Router, private profile:BankServicesService, private auth:LoginRegisterServiceService){}
  ngOnInit():void{
    this.username = localStorage.getItem("username")
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.fullName = this.firstName + " " + this.lastName
    this.initials = this.firstName[0] + this.lastName[0]
    let userID = localStorage.getItem("userID");
    
    this.profile.getUserAccountNumberAndMoney(userID!.toString()).subscribe((response) =>{
      localStorage.setItem("rsdAccNum", response.rsdAccountNumber);
      localStorage.setItem("eurAccNum", response.eurAccountNumber);
      this.rsdAccNum = response.rsdAccountNumber
      this.eurAccNum = response.eurAccountNumber

      this.eurValue = response.eurMoney
      this.rsdValue = response.rsdMoney
      this.profile.getAllTransactions(userID!.toString()).subscribe((response) =>{
        this.transactions = response
        for(let i = 0; i < this.transactions.length;i++){
          if(this.transactions[i].senderUsername == this.username || this.transactions[i].receiverAccountNumber == this.rsdAccNum){
            this.transactions[i].show = true
          }else this.transactions[i].show = false
        }
        console.log(this.transactions)
      })
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })

    
    // setTimeout(() => {
    //   localStorage.clear()
    //   this.route.navigate(["/Login"])
    // }, 5000);
  }
  changeToHome(){
    this.homeTab = true
    this.payinsTab = false
    this.wallet = false
    this.exchangeTab = false

    this.home = true
  }
  chagneToPayings(){
    this.payinsTab = true
    this.homeTab = false
    this.exchangeTab = false
    this.wallet = true
    this.home = false
  }
  exit(name:any){
    
  }
  changeToCalc(){
    this.calc = true
  }
  changeToRate(){
    this.calc = false
  }
  hover(name:any){
  
  }
  logout(){
    localStorage.clear()
    setTimeout(() => {
      this.route.navigate(["\Login"])
    }, 1000);
    
  }
}
