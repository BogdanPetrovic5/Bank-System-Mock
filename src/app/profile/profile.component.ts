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
  
  public eng = true
  public srb = false

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

  //Becouse I do not have proper backend I needed to create array to store all transactions
  public transactions = 
  [
    {receiverName:"",receiverLastName:"",senderName:"",senderLastName:"", money:0,receiverAccountNumber:"", senderUsername:"", show:false}
  ]
  //Becouse I do not have proper backend I needed to create array to store all registered users
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
    //Api call for registered users, later used for various reasons
    this.profile.getRegisteredUsers().subscribe((response)=>{
      this.registeredUsers = response;
      
    },(error:HttpErrorResponse) =>{
      console.log(error)
    })
    //Api call for getting personal data of logged in user, purpose: displaying money, account number etc
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
        
      })
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })

  }
  addFounds(){
    let userID = localStorage.getItem("userID")
    let pin
    let cardNumber
    //In case some user types for eg. 20 000 instead 20000 or 20.000 instead 20000, so that application knows it is a number. ngModel uses string as two way data binding. So its possible
    this.founds = this.founds.split(' ').join('')
    this.founds = this.founds.split(',').join('')
    this.founds = this.founds.split('.').join('')
    
    this.profile.getPersonalData(userID!.toString()).subscribe((response) => {
      //Here I call api for pin and credit And check if loged in user entered good pin. Credit card is manually added into field
      pin = response.pin
      cardNumber = response.cardNumber
      
      if(pin == Number(this.pin) && cardNumber == this.cardNumber){
        this.rsdValue = this.rsdValue + Number(this.founds)
        this.profile.makeChangesToReceiver(userID!.toString(), this.rsdValue).subscribe((response) =>{
          this.pin = ""
          this.founds = ""
        },(error:HttpErrorResponse) =>{
          console.log(error)
        })
      }else alert("Enter right format")
    },(error:HttpErrorResponse) =>{
      console.log(error)
    })
   
    
  }
  showMenu(){
    //For mobile view to hide and show menu
    this.show = !this.show
  }
  makeExchange(){
    //Checking if you wether changing eur for rsd or rsd for eur
    if(this.eur.length == 0 && this.rsd.length != 0){
      //Same goes here, checking if you have typed value correctly
      this.rsd = this.rsd.split(' ').join('')
      this.rsd = this.rsd.split(',').join('')
      this.rsd = this.rsd.split('.').join('')
      let currentMoney = Number(this.rsd) / 117.00
      this.eurValue += currentMoney
      if(this.rsdValue - Number(this.rsd) >= 0){
        this.rsdValue -= Number(this.rsd)
        let userID = localStorage.getItem("userID");
        
        this.profile.exchange(userID!.toString(), this.eurValue,this.rsdValue).subscribe((response)=>{
          
          this.rsd = ""
        },(error:HttpErrorResponse) =>{
          console.log(error)
        })
      }else alert("Not enough money!")
      
    }
    //Checking if you wether changing eur for rsd or rsd for eur
    if(this.eur.length != 0 && this.rsd.length == 0){
      //Same goes here, checking if you have typed value correctly
      this.eur = this.eur.split(' ').join('')
      this.eur = this.eur.split(',').join('')
      this.eur = this.eur.split('.').join('')
      let currentMoney = Number(this.eur) * 117.00
      this.rsdValue += currentMoney
      this.eurValue -= Number(this.eur)
      let userID = localStorage.getItem("userID");
      this.profile.exchange(userID!.toString(), this.eurValue,this.rsdValue).subscribe((response)=>{
        
        this.eur = ""
      },(error:HttpErrorResponse) =>{
        console.log(error)
      })
    }
    
  }

  


  makeChangesToReceiver(){
    //Checking for format again...
    this.value = this.value.split(' ').join('')
    this.value = this.value.split(',').join('')
    this.value = this.value.split('.').join('')
    for(let i = 0; i < this.registeredUsers.length;i++){
      if(this.receiverAccNum == this.registeredUsers[i].rsdAccountNumber){
        //Finding the right user and taking his ID so we can change his/her money 
        let ID = i + 1;
        //Api call for that purpose
        this.profile.getPersonalData(ID!.toString()).subscribe((response) =>{
          let currentMoney = response.rsdMoney
          currentMoney = currentMoney + Number(this.value);
          this.profile.makeChangesToReceiver(ID!.toString(), currentMoney).subscribe((response) => {
            
          })
        })
      }
    }
  }
  makeChangesToSender(){
    //Make changes to loged in user
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
    // Gets data from LS
    this.name = localStorage.getItem("firstName");
    this.lastname = localStorage.getItem("lastName")
    this.username = localStorage.getItem("username")

    //Checks if fields are filled
    if(this.receiverName != "" && this.receiverLastName != "" && this.receiverAccNum != "" && this.value != ""){
      this.value = this.value.split(' ').join('')
      this.value = this.value.split(',').join('')
      this.value = this.value.split('.').join('')
      //Checks if you are trying to make payment on eur acc if yes it throws alert
      if(this.receiverAccNum.length == 10){
        // Checks if you are trying to make payment to yourself
        if(this.receiverAccNum != this.rsdAccNum){
          //Checks if u have enough resources
          if(this.rsdValue - Number(this.value) >= 0){
            //Api calls for transaction
            this.profile.makeTransaction(this.receiverName,this.receiverLastName,this.receiverAccNum, this.value, this.name, this.lastname, this.username ).subscribe((response) =>{
              setTimeout(()=>{
                this.makeChangesToSender()
                this.makeChangesToReceiver()
                alert("Uspesno placeno!")
                
              },2000)
              
            },(error:HttpErrorResponse) =>{
              console.log(error)
            })
          }else alert("Not enough money!")
          
        }else alert("You can't pay yourself!")
      }else alert("You can't pay to EUR account!")
    }else alert("Please fill all fields")
    
  }
  //Switches between tabs
  changeToHome(){
    this.homeTab = true
    this.payinsTab = false
    this.wallet = false
    this.exchangeTab = false

    this.home = true
  }
  //Switches between tabs
  chagneToPayings(){
    this.payinsTab = true
    this.homeTab = false
    this.exchangeTab = false
    this.wallet = true
    this.home = false
  }
  exit(name:any){
    
  }
  //Switches between tabs
  changeToCalc(){
    this.calc = true
  }
  //Switches between tabs
  changeToRate(){
    this.calc = false
  }
  hover(data:any){

  }
  //logout
  logout(){
    localStorage.clear()
    setTimeout(() => {
      this.route.navigate(["\Login"])
    }, 1000);
    
  }
  //Language change
  changeToSrb(){
    this.srb = true
    this.eng = false
  }
    //Language change
  changeToEng(){
    this.eng = true
    this.srb = false
  }
}
