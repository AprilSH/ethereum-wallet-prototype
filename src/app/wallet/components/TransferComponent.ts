import { Component,OnInit,Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'transfer-form',
  templateUrl: '../views/transfer-template.html',
  styleUrls: ['../views/transfer-template.css'] 
})
export class TransferComponent implements OnInit {
  
  @Output() OnEtherSend = new EventEmitter<boolean>();
  form : FormGroup;	 
  _listAccount : any[];
  constructor(private ws : WalletContractService,private fb : FormBuilder){
	    
  }
  
  ngOnInit(){
		const group = this.fb.group({});
		
		group.addControl('fromEmail',new FormControl(''));
		group.addControl('toEmail',new FormControl(''));
		group.addControl('amount',new FormControl(''));
		group.addControl('fromPasswd',new FormControl(''));
		
		this.form = group;
  }
  
  onSubmit(form){
	  let _self = this;
	  this.ws.transferFund(form.value.fromEmail,form.value.fromPasswd,form.value.toEmail,form.value.amount).subscribe(function(result){
		  _self.OnEtherSend.emit(true);
	  });
  }
}
