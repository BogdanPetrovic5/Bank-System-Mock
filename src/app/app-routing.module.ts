import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginGuard } from './guards/login.guard';
import { ProfileGuard } from './guards/profile.guard';
const routes: Routes = [
  {path:"", redirectTo:"Main Page", pathMatch:"full"},
  {path:"Main Page", component:MainPageComponent,canActivate:[LoginGuard]},
  {path:"Login", component:RegisterLoginComponent, canActivate:[LoginGuard]},
  {path:"Profile", component:ProfileComponent, canActivate:[ProfileGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
