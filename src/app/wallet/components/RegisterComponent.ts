import { Component,OnInit,Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'register-form',
  templateUrl: '../views/register-template.html',
  styleUrls: ['../views/register-template.css']
})
export class RegisterComponent implements OnInit {
  
  @Output() OnAccountCreate = new EventEmitter<boolean>();
  @Output() OnCreate = new EventEmitter<boolean>();
  form : FormGroup;	 
  constructor(private ws : WalletContractService,private fb : FormBuilder){
	    
  }
  
  
  
  ngOnInit(){
		const group = this.fb.group({});
		
		group.addControl('email',new FormControl(''));
		group.addControl('passwd',new FormControl(''));
		
		this.form = group;
  }
  
  onSubmit(form){
	  let _self = this;
	  this.ws.createAccount(form.value.email,form.value.passwd).subscribe(function(result){
		  _self.OnAccountCreate.emit(true);
	  });
  }

  clearForm(){
    this.form.reset();
  }

  onCreate(){
    this.OnCreate.emit(true);
    console.log("success");
  }
}
