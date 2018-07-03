import { Component,OnInit,Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'import-form',
  templateUrl: '../views/import-template.html',
  styleUrls: ['../views/import-template.css']
})
export class ImportComponent implements OnInit {
  
  @Output() OnAccountImport = new EventEmitter<boolean>();
  @Output() OnImport = new EventEmitter<boolean>();
  form : FormGroup;
  constructor(private ws : WalletContractService,private fb : FormBuilder){
	    
  }
  
  ngOnInit(){
		const group = this.fb.group({});
		
		group.addControl('email2',new FormControl(''));
        group.addControl('passwd2',new FormControl(''));
        group.addControl('privKey',new FormControl(''));
		
		this.form = group;
  }
  
  onSubmit(form){
	  let _self = this;
	  this.ws.importAccount(form.value.email2,form.value.passwd2,form.value.privKey).subscribe(function(result){
		  _self.OnAccountImport.emit(true);
	  });
  }

  clearForm(){
    this.form.reset();
  }

  onImport(){
    this.OnImport.emit(true);
  }
}
