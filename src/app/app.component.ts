import { Component } from '@angular/core';
import { WalletContractService } from './wallet/WalletContractService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  
  constructor(ws : WalletContractService){
	   
  }
}
