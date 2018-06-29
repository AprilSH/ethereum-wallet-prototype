import { Component,OnInit,Output,Input,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, NgModel } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'transfer-form',
  templateUrl: '../views/transfer-template.html',
  styleUrls: ['../views/transfer-template.css'] 
})
export class TransferComponent implements OnInit {
  
  @Output() OnEtherSend = new EventEmitter<boolean>();
  @Output() OnTokenSend = new EventEmitter<boolean>();
  @Output() OnSend = new EventEmitter<boolean>();
  form : FormGroup;	 
  _listAccount : any[];
  tokenList : any[];
  isTokenSend = false;
  constructor(private ws : WalletContractService,private fb : FormBuilder){
	    
  }
  
  ngOnInit(){
		const group = this.fb.group({});
    
    group.addControl('asset',new FormControl(''));
    group.addControl('tokenSelect',new FormControl(''));
		group.addControl('fromEmail',new FormControl(''));
		group.addControl('toEmail',new FormControl(''));
		group.addControl('amount',new FormControl(''));
		group.addControl('fromPasswd',new FormControl(''));
		
    this.form = group;
    this.loadListToken();
  }

  onSubmit(form){
    let _self = this;
    if (form.value.asset){
      this.ws.sendToken(form.value.tokenSelect,form.value.fromEmail,form.value.fromPasswd,form.value.toEmail,form.value.amount).subscribe(function(result){
        if (result){
          // _self.OnTokenSend.emit(true);
          _self.OnEtherSend.emit(true);
        }
      });
    }
    else{
      this.ws.transferFund(form.value.fromEmail,form.value.fromPasswd,form.value.toEmail,form.value.amount).subscribe(function(result){
        _self.OnEtherSend.emit(true);
      });
    }
  }

  loadListToken(){
		this.ws.getListToken("").subscribe(response=>{
      this.tokenList = response;
	  });
  }

  onSend(){
    this.OnSend.emit(true);
  }

  clearForm(){
    this.form.reset();
  }

  showTokenOption(option){
    this.isTokenSend = option;
  }
}
