import { Component } from '@angular/core';
import { LoginRegisterService } from '../registerLoginServices/login-register.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-login',
  templateUrl: './register-login.component.html',
  styleUrls: ['./register-login.component.scss']
})
export class RegisterLoginComponent {
  public active = true;
  public dropDown = false;
  public dropDownObject:any

  public userNameLogin = ""
  public passwordLogin = ""
  public elementalForm = true
  public personalData = false
  public credentialsData = false


  public userNameRegister = ""
  public passwordRegister = ""
  public cardNumber = ""
  public emailRegister = ""
  constructor(private auth: LoginRegisterService){}
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
    this.auth.register(this.userNameRegister, this.passwordRegister, this.cardNumber, this.emailRegister).subscribe((response) =>{
      alert("Uspesno")
      this.userNameRegister = ""
      this.passwordRegister = ""
      this.cardNumber = ""
      this.emailRegister = ""
    },(error:HttpErrorResponse)=>{
      console.log(error);
    })
  }


}
