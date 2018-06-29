import { Component,OnInit,Output, EventEmitter, group } from '@angular/core';
import { WalletContractService } from '../WalletContractService';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'account-list',
  templateUrl: '../views/account-list-template.html',
  styleUrls: ['../views/account-list-template.css'] 
})
export class AccountListComponent implements OnInit {
  @Output() OnTokenAdd = new EventEmitter<string>();
  form : FormGroup;
  listToken : any[];
  tokenBalance : any[];
  currAccnt = "";
  txStatus = "";
  status = false;
  isEmpty = false;
  isLoad = false;
  isClear = false;
  constructor(private ws : WalletContractService,private fb : FormBuilder){
	    
  }
  
  ngOnInit(){
    this.loadListToken("0xbc1a8c8b973390c2dd4e4f71193c49b6a133ee16");
    this.currAccnt = "0xbc1a8c8b973390c2dd4e4f71193c49b6a133ee16"
    const group = this.fb.group({});
		group.addControl('tokenAddress',new FormControl(''));
		this.form = group;
  }

  loadListToken(address){
    this.currAccnt = address;
		this.ws.getListToken(address).subscribe(response=>{
      if (response.length > 0){
        this.isEmpty = true;
        this.listToken = response;
      }
	  });
  }

  clearToken(){
    let _self=this;
    this.isLoad = true;
    this.ws.clearTokenList().subscribe(response=>{
      this.isEmpty = false;
      this.isLoad = false;
    });
  }

  onSubmit(form){
    let _self=this;
    this.status = true;
    this.isLoad = true;
    this.txStatus = "Pending..."
	  this.ws.addToken(form.value.tokenAddress).subscribe(function(result){
      if (result){
        _self.txStatus = "Completed"
        _self.isLoad = false;
        _self.OnTokenAdd.emit(_self.currAccnt);
      }
      else{
        _self.txStatus = "Token Already Exist"
      }
      
	  });
  }

  reset(){
    this.txStatus = "Pending...";
    this.status = false;
    this.form.reset();
  }
  
  toggleModal(toggle){
    if (toggle == 1){
      this.isClear = true;
    }
    else{
      this.isClear = false;
    }
  }
  
}
