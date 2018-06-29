import { Component,OnInit,Output, EventEmitter,ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { WalletContractService } from '../WalletContractService';
import { TransferComponent } from '../components/TransferComponent';
import { ExtractKeyComponent } from '../components/ExtractKeyComponent';

@Component({
  selector: 'account-details',
  templateUrl: '../views/details-template.html',
  styleUrls: ['../views/details-template.css'],
})
export class DetailComponent implements OnInit {
  @ViewChild(TransferComponent)
  private transfer: TransferComponent;
  @ViewChild(ExtractKeyComponent)
  private view: ExtractKeyComponent;
  @Output() OnChangeAccount = new EventEmitter<string>();
  @Output() OnClose = new EventEmitter<boolean>();
  modalLabel = "";
  statusMsg = "";
  currAccnt = "";
  accountInfo : any[]; 
  listAccount : any[]; 
  viewCreate = false;
  viewImport = false;
  viewKey = false;
  viewSend = false;
  status = false;
  test : any;

  constructor(private ws : WalletContractService,private fb : FormBuilder){
    
  }
  
  ngOnInit(){
    this.loadAccountInfo(true,"main@email.com");
    this.loadAccountList(true,0);
  }

  loadAccountInfo(reloadList, account){
    this.currAccnt = account;
	  if(reloadList){
		 this.ws.getAccount(account).subscribe(response=>{
        this.accountInfo = response;
        this.OnChangeAccount.emit(response[1]);
		  });
	  }
  }

  loadAccountList(reloadList, flag){
	  if(reloadList){
      if (flag == 0){
        this.statusMsg = "Pending...";
      }
      else{
        this.statusMsg = "Completed";
      }
		  this.ws.getListAccount().subscribe(response=>{
        this.listAccount = response;
        console.log(response);
      });
    }
  }

  modalView(view){
    if (view == 1) {
      this.modalLabel = "Create Account";
      this.viewCreate = true;
      this.viewImport = false;
      this.viewKey = false;
      this.viewSend = false;
    }
    else if (view == 2) {
      this.modalLabel = "Import Account";
      this.viewCreate = false;
      this.viewImport = true;
      this.viewKey = false;
      this.viewSend = false;
    }
    else if (view == 3) {
      this.modalLabel = "View Private Key";
      this.viewCreate = false;
      this.viewImport = false;
      this.viewKey = true;
      this.viewSend = false;
    }
    else if (view == 4) {
      this.modalLabel = "Send Asset";
      this.viewCreate = false;
      this.viewImport = false;
      this.viewKey = false;
      this.viewSend = true;
    }
    else {
      console.log("ERROR: Invalid View");
    } 
    
  }

  setStatus($event){
      this.status = $event;
      this.statusMsg = "Pending..."
  }

  txStatus(){
    this.status = false;
    this.statusMsg = "Pending..."
    this.test = true;
    this.transfer.clearForm();
    // this.view.clearForm();
  }
}
