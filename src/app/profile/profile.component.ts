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
  
  public rsd = ""
  public eur = ""

  public value = ""
  public receiverName = ""
  public receiverLastName = ""
  public receiverAccNum = ""
  public name:any
  public lastname:any
  public receiverID:any
  public rsdAccNum:any
  public eurAccNum:any
  public username:any
  public eurValue = 0
  public rsdValue = 0
  public calc = true
  public homeTab = true;
  public payinsTab = false
  public exchangeTab = false

  public cardNumber = ""
  public pin = ""
  public founds = ""
  public show = false
  public transactions = [{receiverName:"",receiverLastName:"",senderName:"",senderLastName:"", money:0,receiverAccountNumber:"", senderUsername:"", show:false}]

  public registeredUsers = 
  [
    {name:"", lastName:"", password:"",username:"",email:"",cardNumber:"", id:Object, rsdAccountNumber:"",rsdMoney:0, eurMoney:0}
  ]
  constructor(private route: Router, private profile:BankServicesService, private auth:LoginRegisterServiceService){}
  ngOnInit():void{
    
    this.username = localStorage.getItem("username")
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
    this.fullName = this.firstName + " " + this.lastName
    this.initials = this.firstName[0] + this.lastName[0]
    let userID = localStorage.getItem("userID");
    this.profile.getRegisteredUsers().subscribe((response)=>{
      this.registeredUsers = response;
      console.log(this.registeredUsers)
    },(error:HttpErrorResponse) =>{
      console.log(error)
    })
    this.profile.getPersonalData(userID!.toString()).subscribe((response) =>{
      localStorage.setItem("rsdAccNum", response.rsdAccountNumber);
      localStorage.setItem("eurAccNum", response.eurAccountNumber);
      this.rsdAccNum = response.rsdAccountNumber
      this.eurAccNum = response.eurAccountNumber
      this.cardNumber = response.cardNumber
      this.eurValue = response.eurMoney
      this.rsdValue = response.rsdMoney
      this.profile.getAllTransactions(userID!.toString()).subscribe((response) =>{
        this.transactions = response
        for(let i = 0; i < this.transactions.length;i++){
          if(this.transactions[i].senderUsername == this.username || this.transactions[i].receiverAccountNumber == this.rsdAccNum){
            this.transactions[i].show = true
          }
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
  addFounds(){
    let userID = localStorage.getItem("userID")
    let pin
    let cardNumber
    this.founds = this.founds.split(' ').join('')
    this.founds = this.founds.split(',').join('')
    this.founds = this.founds.split('.').join('')
    this.profile.getPersonalData(userID!.toString()).subscribe((response) => {
      pin = response.pin
      cardNumber = response.cardNumber
      console.log(response.pin, response.cardNumber)
      if(pin == Number(this.pin) && cardNumber == this.cardNumber){
        
        this.profile.makeChangesToReceiver(userID!.toString(), this.founds, this.rsdValue).subscribe((response) =>{
          this.rsdValue = this.rsdValue + Number(this.founds)
        },(error:HttpErrorResponse) =>{
          console.log(error)
        })
      }else alert("Nije dobro")
    },(error:HttpErrorResponse) =>{
      console.log(error)
    })
   
    
  }
  showMenu(){
    this.show = !this.show
  }
  makeExchange(){
    

    console.log("DA")
    if(this.eur.length == 0 && this.rsd.length != 0){
      console.log("DA")
      this.rsd = this.rsd.split(' ').join('')
      this.rsd = this.rsd.split(',').join('')
      this.rsd = this.rsd.split('.').join('')
      let currentMoney = Number(this.rsd) / 117.00
      this.eurValue += currentMoney
      this.rsdValue -= Number(this.rsd)
      let userID = localStorage.getItem("userID");
      this.profile.exchange(userID!.toString(), this.eurValue,this.rsdValue).subscribe((response)=>{
        console.log("Da")
        this.rsd = ""
      },(error:HttpErrorResponse) =>{
        console.log(error)
      })
    }
    if(this.eur.length != 0 && this.rsd.length == 0){
      console.log("DA")
      this.eur = this.eur.split(' ').join('')
      this.eur = this.eur.split(',').join('')
      this.eur = this.eur.split('.').join('')
      let currentMoney = Number(this.eur) * 117.00
      this.rsdValue += currentMoney
      this.eurValue -= Number(this.eur)
      let userID = localStorage.getItem("userID");
      this.profile.exchange(userID!.toString(), this.eurValue,this.rsdValue).subscribe((response)=>{
        console.log("Da")
        this.eur = ""
      },(error:HttpErrorResponse) =>{
        console.log(error)
      })
    }
    
  }

  


  makeChangesToReceiver(){
    this.value = this.value.split(' ').join('')
    this.value = this.value.split(',').join('')
    this.value = this.value.split('.').join('')
    for(let i = 0; i <this.registeredUsers.length;i++){
      if(this.receiverAccNum == this.registeredUsers[i].rsdAccountNumber){
        let ID = i + 1;
        this.profile.makeChangesToReceiver(ID!.toString(), this.value,this.registeredUsers[i].rsdMoney).subscribe((response) =>{
          console.log("Da")
        },(error:HttpErrorResponse) =>{
          console.log(error)
        })
      }
    }
  }
  makeChangesToSender(){
    let userID = localStorage.getItem("userID");
    this.value = this.value.split(' ').join('')
    this.value = this.value.split(',').join('')
    this.value = this.value.split('.').join('')
    this.profile.makeChangesToSender(userID!.toString(), this.value, this.rsdValue).subscribe((response) =>{
      this.rsdValue = response.rsdMoney
    },(error:HttpErrorResponse) =>{
      console.log(error)
    })
  }
  pay(){
    this.name = localStorage.getItem("firstName");
    this.lastname = localStorage.getItem("lastName")
    this.username = localStorage.getItem("username")

    
    if(this.receiverName != "" && this.receiverLastName != "" && this.receiverAccNum != "" && this.value != ""){
      this.value = this.value.split(' ').join('')
      this.value = this.value.split(',').join('')
      this.value = this.value.split('.').join('')
      if(this.receiverAccNum.length == 10){
        if(this.receiverAccNum != this.rsdAccNum){
          this.profile.makeTransaction(this.receiverName,this.receiverLastName,this.receiverAccNum, this.value, this.name, this.lastname, this.username ).subscribe((response) =>{
            setTimeout(()=>{
              this.makeChangesToSender()
              this.makeChangesToReceiver()
              alert("Uspesno placeno!")
            },2000)
            
          },(error:HttpErrorResponse) =>{
            console.log(error)
          })
        }else alert("Ne mozes ovako uplatiti novac na svoj racun!")
      }else alert("Ne mozes uplatiti na devizni racun")
    }else alert("Unesi sva polja")
    
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
