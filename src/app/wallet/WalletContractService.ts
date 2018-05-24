import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

//import * as Web3 from 'web3';
import * as W3 from 'web3';
const Web3 = require('web3'); // tslint:disable-line
import * as Web3Account from 'web3-eth-accounts';
import * as Web3Personal from 'web3-eth-accounts';
declare let require: any;
declare let window: any;

let tokenAbi = require('./WalletContractABI.json');
 
@Injectable() 
export class WalletContractService {
	private _contractAddress : string = "0xa90f5be67f6dec3eaf3ff9b14511c671cb6df131";
	private _walletContract : any;
	private _web3: any;
	private _web3Account : any;
	private _web3Personal : any;
	
	constructor(){
		// const testnet = 'https://ropsten.infura.io/';
		// if(typeof window.web3 !== 'undefined'){
		// 	this._web3 = new Web3(window.web3.currentProvider);
		//     console.log("existing web3: provider " + typeof this._web3);
		// }else{
			this._web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
			// this._web3 = new Web3(new Web3.providers.HttpProvider(testnet));
		//}
		
		//this._web3.eth.getAccounts().then(result=>{
			this._web3.eth.defaultAccount = "0xbc1a8c8b973390c2dd4e4f71193c49b6a133ee16";
			this._walletContract = new this._web3.eth.Contract(tokenAbi,this._contractAddress,{ from: this._web3.eth.defaultAccount });				
			this._web3Account = new Web3Account('ws://localhost:8546');
			this._web3Personal = new Web3Personal('ws://localhost:8546');
			
			
		//});
		
		
		/*
		/*,function(error,result){
			
			if(!error){
				if(!result[0]){
					console.log(result[1]);
				}
				else{
					console.log("Successfully created account");
				}
			}
			else{
				console.error(error.message);
			}
			
		}
		*/
		
		
		//let newAcct = web3.eth.accounts.create();
		
		//web3.eth.getAccounts(console.log);
		
		//console.log(this._web3Account);
		
		
		
		/*this._walletContract.AddAccount.call("randy@ivp.co.jp",newAcct.address,newAcct.privateKey,{from: web3.eth.accounts[0], gas:3000000},function(error,result){
			
			if(!error){
				if(!result[0]){
					console.log(result[1]);
				}
				else{
					console.log("Successfully created account");
				}
			}
			else{
				console.error(error.message);
			}
			
		});
		
		/*web3.eth.getBalance("0xa4668e4a391a17b4eff5f1b8f15bbc452f2d4fc8",function(error,wei){
							if(!error){
								var balance = web3.fromWei(wei, 'ether');
								console.log(balance.c[0] + ' Ether');
							}else{
								console.error(error);
							}
					});	
		
		/*/
	} 
	 
	createAccount(email: string ,passwd : string) : Observable<any> {
		
		return Observable.fromPromise(this._walletContract.methods.isEmailExist(email).call()).mergeMap(result=>{
			if(result){
				return Observable.of(false);
			}else{
				let newAccnt = this._web3.eth.accounts.create();
				return Observable.fromPromise(this._web3.eth.personal.importRawKey(newAccnt.privateKey.replace("0x",""),passwd)).mergeMap(rspAcctAddr=>{
					return Observable.fromPromise(this._walletContract.methods.registerAccount(email,rspAcctAddr,newAccnt.privateKey).call()).mergeMap(rspChckRegister=>{
					if(rspChckRegister[0]){
					  return Observable.fromPromise(this._walletContract.methods.registerAccount(email,rspAcctAddr,newAccnt.privateKey).send({gas:3000000 })
								.on('error', function(error){
									console.error(error);
									return Observable.of(false);
								})
								.on('receipt',function(receipt){
									console.log(receipt);
									return Observable.of(true);
								})
							);
						}else{
						  console.error(rspChckRegister[1]);
						  return Observable.of(false);
						}
					});
				});
				
				/*return Observable.fromPromise(this._walletContract.methods.registerAccount(email,accntAddr,newAccnt.privateKey).call()).mergeMap(rsp=>{
					if(rsp[0]){
					  return Observable.fromPromise(this._walletContract.methods.registerAccount(email,accntAddr,newAccnt.privateKey).send({gas:3000000 })
							.on('error', function(error){
								console.error(error);
								return Observable.of(false);
							})
							.on('receipt',function(receipt){
								console.log(receipt);
								return Observable.of(true);
							})
						);
					}else{
					  console.error(rsp[1]);
					  return Observable.of(false);
					}
				});*/
			}
			
		});		
	}


	importAccount(email: string ,passwd : string, privKey : string) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.isEmailExist(email).call()).mergeMap(result=>{
		
			// return Observable.fromPromise(this._web3.eth.personal.unlockAccount("0x1F9ad66025fB46ca92FBDB1277ce92e718897365", passwd, 300)).mergeMap(result=>{
			// 	console.log(result);
			// 	if(result){
			// 		return Observable.of(false);
			// 	}
			// 	else{
			// 		return Observable.of(false);
			// 	}
			// });
			// try {
			// 	const foo = 8;
			// 	const bar = 9;
			//   }
			//   catch(e) {
			// 	console.log('Error:', e);
			//   }
			// return Observable.fromPromise(this._web3.eth.personal.importRawKey("4e42e964c77b7278d131f0eb975ae11774ec61389ec31376b09f9b8ac12603b0",passwd)).mergeMap(rspAcctAddr=>{
			// 	console.log(rspAcctAddr);
			// 	return Observable.of(false);
			// });
			  
			if(result){
				return Observable.of(false);
			}
			else{
				// let importAccnt = this._web3.eth.accounts.privateKeyToAccount(privKey);
				return Observable.fromPromise(this._web3.eth.personal.importRawKey(privKey.replace("0x",""),passwd)).mergeMap(AddressFromRawKey=>{
					return Observable.fromPromise(this._walletContract.methods.getAccountByAddress(AddressFromRawKey).call()).mergeMap(rspAcctAddr=>{
						if (rspAcctAddr == ""){
							return Observable.fromPromise(this._walletContract.methods.registerAccount(email,AddressFromRawKey,privKey).call()).mergeMap(rspChckRegister=>{
								if(rspChckRegister[0]){
									return Observable.fromPromise(this._walletContract.methods.registerAccount(email,AddressFromRawKey,privKey).send({gas:3000000 })
										.on('error', function(error){
											console.error(error);
											return Observable.of(false);
										})
										.on('receipt',function(receipt){
											console.log(receipt);
											return Observable.of(true);
										})
									);
								}
								else{
									console.error(rspChckRegister[1]);
									return Observable.of(false);
								}
							});
						}
						else{
							return Observable.of(false);
						}
					});
				});
			}
			
		});
	}

	exportKey(email: string ,passwd : string) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.getAccountByEmail(email).call()).mergeMap(rspAcctAddr=>{
			console.log(rspAcctAddr[2]);
			return Observable.fromPromise(this._web3.eth.personal.unlockAccount(rspAcctAddr[1], passwd, 300)).mergeMap(result=>{
				if (result){
					return Observable.of(rspAcctAddr[2]);
				}else{
					return Observable.of(false);
				}
			});	
		});
	}

	getAccount(email : string): Observable<any>{
		return Observable.fromPromise(this._walletContract.methods.getAccountByEmail(email).call()).mergeMap(response=>{
			return this.getBalance(response[1]).mergeMap(rsBal=>{
			    return Observable.of(Object.assign({ balance : rsBal },response));				
			});
		});
	} 	
	transferFund(fromEmail : string, fromPsswd : string, toEmail:string,amount : number): Observable<any>{
		if(fromEmail){		
		    if(fromPsswd){
				return this.getAccount(fromEmail).mergeMap(response=>{		
					this._web3.eth.personal.unlockAccount(response['aAcctAddr'], fromPsswd, 300);				
					return Observable.fromPromise(this._walletContract.methods.transferFunds(toEmail).send({from : response['aAcctAddr'] ,value: this._web3.utils.toWei(amount)}));			
				});
			}else{
				return Observable.of(false);
			}
		}else{
			return Observable.fromPromise(this._walletContract.methods.transferFunds(toEmail).send({value: this._web3.utils.toWei(amount)}));			
		}		
	}
	
	getListAccount() : Observable<any>{
		return Observable.fromPromise(this._walletContract.methods.getListAccount().call())
			.mergeMap(listAddrss=>{
				let greq = [];
				(listAddrss as Array<string>).forEach(addr=>{
					let req = Observable.fromPromise(this._walletContract.methods.getAccountByAddress(addr).call());
					greq.push(req);
				});
				return Observable.forkJoin(greq);
			}).mergeMap(listEmail=>{
				let greq = [];
				(listEmail as Array<string>).forEach(email=>{
					greq.push(this.getAccount(email));					
				});
				return Observable.forkJoin(greq);
			});
	}
	
	getBalance(addr : string) : Observable<any>{
		return Observable.fromPromise(this._web3.eth.getBalance(addr)).map(response=>{
			return this._web3.utils.fromWei(response, 'ether');
		});
	}
}