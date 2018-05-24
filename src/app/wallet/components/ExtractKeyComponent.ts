import { Component,OnInit,Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';

@Component({
  selector: 'extractKey-form',
  templateUrl: '../views/extractKey-template.html',
  styleUrls: ['../views/extractKey-template.css']
})
export class ExtractKeyComponent implements OnInit {
  
  @Output() OnKeyExport = new EventEmitter<boolean>();
  form : FormGroup;
  constructor(private ws : WalletContractService,private fb : FormBuilder){
    
  }
  
  ngOnInit(){
		const group = this.fb.group({});
		group.addControl('emailExtract',new FormControl(''));
    group.addControl('passExtract',new FormControl(''));
    group.addControl('privKeyExtract',new FormControl(''));
		
    this.form = group;
  }
  
  onSubmit(form){
	  let _self = this;
	  this.ws.exportKey(form.value.emailExtract,form.value.passExtract).subscribe(function(result){
      form.controls["privKeyExtract"].setValue(result);
      console.log(this.text + " result");
      _self.OnKeyExport.emit(true);
	  });
  }
}
