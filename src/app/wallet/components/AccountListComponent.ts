import { Component,OnInit } from '@angular/core';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'account-list',
  templateUrl: '../views/account-list-template.html',
  styleUrls: ['../views/account-list-template.css'] 
})
export class AccountListComponent implements OnInit {
  
  _listAccount : any[];
  constructor(private ws : WalletContractService){
	    
  }
  
  ngOnInit(){
		this.loadListAccount(true);
  }
  
  loadListAccount(reloadList){
	  if(reloadList){
		 this.ws.getListAccount().subscribe(response=>{
				this._listAccount = response;
		 });
	 }
  }
  
  
}
