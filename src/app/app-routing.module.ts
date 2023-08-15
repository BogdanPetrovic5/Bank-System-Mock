import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:"", redirectTo:"Main Page", pathMatch:"prefix"},
  {path:"Main Page", component:MainPageComponent},
  {path:"Login", component:RegisterLoginComponent},
  {path:"Profile", component:ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
