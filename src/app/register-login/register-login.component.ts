import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRegisterServiceService } from '../servicesBank/login-register-service.service';
import { last } from 'rxjs';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent {
  public active = true;
  public dropDown = false;
  public dropDownObject:any
  public userID:any
  public userNameLogin = ""
  public passwordLogin = ""
  public elementalForm = true
  public personalData = false
  public credentialsData = false
  public name = ""
  public lastName =""
  public rsdAccNum = ""
  public eurAccNum = ""
  public userNameRegister = ""
  public passwordRegister = ""
  public cardNumber = ""
  public emailRegister = ""
  public pin = ""
  public badCN = false
  public badPin = false
  public notEnoughCharacters = false


  public eng = true;
  public srb = false
  constructor(private auth: LoginRegisterServiceService, private route: Router){}
  public registeredUsers = 
  [
    {name:"", lastName:"", password:"",username:"",email:"",cardNumber:"", id:Object}
  ]
  changeToLogin(){
    //Changing to login form
    if(this.active == true) this.active = false;
    this.elementalForm = true
    this.personalData = false
    this.credentialsData = false
    
    
  }
  changeToRegister(){
    // Changing to register form
    if(this.active == false) this.active = true;
  }
  showDropDown(){
    //Drop down
    this.dropDown = !this.dropDown
  }


 //Slider animation
  nextToCredentials(){
    this.elementalForm = false
    this.personalData = false
    this.credentialsData = true
    document.getElementById("progressBarSlide")!.style.transform = "translateX(200%)"
  }
  nextToPersonalData(){
    this.credentialsData = false
    this.elementalForm = false
    this.personalData = true
    document.getElementById("progressBarSlide")!.style.transform = "translateX(100%)"
  }
  previouseToElementalForm(){
    this.personalData = false
    this.elementalForm = true
   
    document.getElementById("progressBarSlide")!.style.transform = "translateX(0)"
  }
  previouseToPersonalData(){
    this.credentialsData = false
    this.personalData = true
    document.getElementById("progressBarSlide")!.style.transform = "translateX(100%)"
  }
  //Slider animation

//Checks for input focuses to show if format is good
  checkFocus(){
    if(this.cardNumber.length != 16){
      this.badCN = true
    }else this.badCN = false
  }
  passwordCheck(){
    if(this.passwordRegister.length < 6){
      this.notEnoughCharacters = true
    }else this.notEnoughCharacters = false
  }
  pinCheck(){
    if(this.pin.length != 4){
      this.badPin = true
    }else this.badPin = false
  }
  //Checks for input focuses to show if format is good
  
  //Register
  register(){
    //Checks if every field is filled.
    if(this.userNameRegister != "" && (this.passwordRegister != "" && this.passwordRegister.length >= 6) && this.name != "" && this.lastName != "" && (this.cardNumber != "" && this.cardNumber.length == 16) && this.emailRegister != "" && (this.pin != "" && this.pin.length == 4)){
      //Creates random rsd acc number
      for(let i = 0; i < 10; i++){
        let random = Math.floor(Math.random() * 10);
        this.rsdAccNum += random
      }
      //Creates random rsd acc number
      for(let i = 0; i < 9; i++){
        let random = Math.floor(Math.random() * 10);
        this.eurAccNum += random
      }
      //Register
      this.auth.getRegisteredUsers().subscribe((response) =>{
        //Becouse I do not have backend code to check for username uniqness I had to take it all to front
        this.registeredUsers = response;
        if((this.registeredUsers.find(x => x.username === this.userNameRegister)) == undefined){
          this.auth.register(this.userNameRegister, btoa(this.passwordRegister), this.cardNumber, this.emailRegister,this.name,this.lastName,this.rsdAccNum,this.eurAccNum, this.pin ).subscribe((response) =>{
            alert("Uspesno")
            this.userNameRegister = ""
            this.passwordRegister = ""
            this.cardNumber = ""
            this.emailRegister = ""
          },(error:HttpErrorResponse)=>{
            console.log(error);
          })
        }else alert("User with this username doesn't exist!")
      })
      
    }else alert("Every field needs to be filled correctly!")
    
  }
  login(){
    //Login
    let check = true
    if(this.userNameLogin.length != 0 && this.passwordLogin.length != 0){
      this.auth.getRegisteredUsers().subscribe((response)=>{
        this.registeredUsers = response;
        for(let i = 0; i < this.registeredUsers.length;i++){
          if(btoa(this.passwordLogin) == this.registeredUsers[i].password && this.userNameLogin == this.registeredUsers[i].username){
            alert("Loged in")
            
            localStorage.setItem("firstName", this.registeredUsers[i].name);
            localStorage.setItem("lastName", this.registeredUsers[i].lastName)
            localStorage.setItem("username", this.registeredUsers[i].username)
            this.route.navigate(["/Profile"])
            this.registeredUsers = []
            
            localStorage.setItem("userID", JSON.stringify(i+1))
            check = true
            break;
          }else check = false
        }
        if(check == false){
          alert("Check password or username!")
          
        }
      })
    }else alert("Enter all fields")
    
  }
  //Language switches
  changeToEng(){
    this.eng = true
    this.srb = false
  }
  changeToSrb(){
    this.srb = true
    this.eng = false
  }
}
