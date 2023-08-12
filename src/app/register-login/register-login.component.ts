import { Component } from '@angular/core';
import { LoginRegisterService } from '../BankServices/login-register.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRegisterServiceService } from '../servicesBank/login-register-service.service';

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

 
  constructor(private auth: LoginRegisterServiceService, private route: Router){}
  public registeredUsers = 
  [
    {name:"", lastName:"", password:"",username:"",email:"",cardNumber:"", id:Object}
  ]
  changeToLogin(){
    
    if(this.active == true) this.active = false;
    this.elementalForm = true
    this.personalData = false
    this.credentialsData = false
    
    
  }
  changeToRegister(){
    
    if(this.active == false) this.active = true;
  }
  showDropDown(){
    this.dropDown = !this.dropDown
  }
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
  register(){
    for(let i = 0; i < 10; i++){
      let random = Math.floor(Math.random() * 10) + 1;
      this.rsdAccNum += random
    }
    for(let i = 0; i < 10; i++){
      let random = Math.floor(Math.random() * 10) + 1;
      this.eurAccNum += random
    }
    
    this.auth.register(this.userNameRegister, btoa(this.passwordRegister), this.cardNumber, this.emailRegister,this.name,this.lastName,this.rsdAccNum,this.eurAccNum ).subscribe((response) =>{
      alert("Uspesno")
      this.userNameRegister = ""
      this.passwordRegister = ""
      this.cardNumber = ""
      this.emailRegister = ""
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
  }
  login(){
    this.auth.login().subscribe((response)=>{
      this.registeredUsers = response;
      for(let i = 0; i < this.registeredUsers.length;i++){
        if(btoa(this.passwordLogin) == this.registeredUsers[i].password && this.userNameLogin == this.registeredUsers[i].username){
          alert("Uspesno ulogovan")
          console.log(this.registeredUsers)
          localStorage.setItem("firstName", this.registeredUsers[i].name);
          localStorage.setItem("lastName", this.registeredUsers[i].lastName)
          localStorage.setItem("username", this.registeredUsers[i].username)
          this.route.navigate(["/Profile"])
          this.registeredUsers = []
          
          localStorage.setItem("userID", JSON.stringify(i+1))
          
          break;
        }
      }

    })
  }

}
