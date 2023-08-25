import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
    public eng = true;
    public srb = false
    changeToSrb(){
      this.srb = true
      this.eng = false
    }
    changeToEng(){
      this.eng = true
      this.srb = false
    }
}
