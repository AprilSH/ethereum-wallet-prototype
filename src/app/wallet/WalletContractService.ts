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

let walletContractAbi = require('./WalletContractABI.json');

let erc20Abi = require('./ERC20ABI.json');

@Injectable() 
export class WalletContractService {
	// private _contractAddress : string = "0xa90f5be67f6dec3eaf3ff9b14511c671cb6df131"; //without token
	private _contractAddress : string = "0x5a4e373577eec380ed45f101c54d5835b6232e7e";
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
			this._web3.eth.defaultAccount = "0xfaa203772013b564a9b60101c8181fe1d9a0087d";
			this._walletContract = new this._web3.eth.Contract(walletContractAbi,this._contractAddress,{ from: this._web3.eth.defaultAccount });				
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

	getInfo(email: string) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.getAccountByEmail(email).call()).mergeMap(rsp=>{
			
			return Observable.fromPromise(this._web3.eth.getBlockNumber()).mergeMap((blk)=>{
				if (rsp){
					return Observable.of(rsp);
				}else{
					return Observable.of(false);
				}
			});
		});
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
				
			}
			
		});		
	}

	importAccount(email: string ,passwd : string, privKey : string) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.isEmailExist(email).call()).mergeMap(result=>{
		
			  
			if(result){
				return Observable.of(false);
			}
			else{
				let AddressFromRawKey = this._web3.eth.accounts.privateKeyToAccount(privKey);
				// return Observable.fromPromise(this._web3.eth.personal.importRawKey(privKey.replace("0x",""),passwd)).mergeMap(AddressFromRawKey=>{
					return Observable.fromPromise(this._walletContract.methods.getAccountByAddress(AddressFromRawKey.address).call()).mergeMap(rspAcctAddr=>{
						if (rspAcctAddr == ""){
							return Observable.fromPromise(this._walletContract.methods.registerAccount(email,AddressFromRawKey.address,privKey).call()).mergeMap(rspChckRegister=>{
								if(rspChckRegister[0]){
									return Observable.fromPromise(this._walletContract.methods.registerAccount(email,AddressFromRawKey.address,privKey).send({gas:3000000 })
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
				// });
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
				rsBal = rsBal/Math.pow(10,18);
			    return Observable.of(Object.assign({ balance : rsBal.toFixed(3) },response));				
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
			return response;
		});
	}


	addToken(tknAddress : string) : Observable<any> {
		var token = new this._web3.eth.Contract(erc20Abi,tknAddress,{ from: this._web3.eth.defaultAccount });
		return Observable.fromPromise(this._walletContract.methods.isTokenExist(tknAddress).call()).mergeMap(exist=>{
			if (exist){
				return Observable.of(false);
			}
			else{
				return Observable.fromPromise(token.methods.symbol().call()).mergeMap(tokenSymbol=>{
					if (tokenSymbol){
						return Observable.fromPromise(token.methods.name().call()).mergeMap(tokenName=>{
							if (tokenName){
								return Observable.fromPromise(this._walletContract.methods.addToken(tknAddress,tokenName,tokenSymbol).call()).mergeMap(response=>{
									if(response){
										return Observable.fromPromise(this._walletContract.methods.addToken(tknAddress,tokenName,tokenSymbol).send({gas:3000000 })
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
										console.error(response);
										return Observable.of(false);
									}
										  
								});
							}
						});
					}
				});
			}
		});
		
	}

	getListToken(address) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.getListToken().call())
			.mergeMap(listToken=>{
				let greq = [];
				(listToken as Array<string>).forEach(addr=>{
					greq.push(this.getTokenInfo(addr,address));
				});
				return Observable.forkJoin(greq);
			});
	}

	getTokenInfo(tknaddress : string, accntAddress : string) : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.getTokenInfo(tknaddress).call()).mergeMap(response=>{
			var token = new this._web3.eth.Contract(erc20Abi,tknaddress,{ from: this._web3.eth.defaultAccount });
			if (accntAddress != ""){
				return Observable.fromPromise(token.methods.balanceOf(accntAddress).call()).mergeMap(rsBal=>{
					return Observable.of(Object.assign({tokenAddress : tknaddress},response,{ balance : rsBal }));				
				});
			}
			else{
				return Observable.of(Object.assign({tokenAddress : tknaddress},response));
			}
			
		});
	}

	sendToken(tknAddress : string, fromEmail : string, fromPsswd : string, toEmail:string, amount : number) : Observable<any> {
		return this.getAccount(fromEmail).mergeMap(response=>{
			return this.getAccount(toEmail).mergeMap(receiverInfo=>{
				var token = new this._web3.eth.Contract(erc20Abi,tknAddress,{ from: this._web3.eth.defaultAccount });
				return Observable.fromPromise(token.methods.balanceOf(response['aAcctAddr']).call()).mergeMap(bal=>{
					if (Number(bal) >= Number(amount)){
						return Observable.fromPromise(this._web3.eth.personal.unlockAccount(response['aAcctAddr'], fromPsswd, 3000)).mergeMap(unlockSender=>{
							if(unlockSender){
								return Observable.fromPromise(token.methods.approve(response['aAcctAddr'],amount).send({gas:3000000 })
									.on('receipt',function(receipt){
										return Observable.fromPromise(token.methods.transferFrom(response['aAcctAddr'],receiverInfo['aAcctAddr'],amount).send({gas:3000000 }));
									})
								);
							}
							else{
								console.log("Invalid Password");
								return Observable.of("Invalid Password");	
							}
						});
					}
					else{
						console.log("Insufficient Balance");
						return Observable.of("Insufficient Balance");	
					}
				});		
			});	
		});
	}

	clearTokenList() : Observable<any> {
		return Observable.fromPromise(this._walletContract.methods.getListToken().call())
			.mergeMap(listToken=>{
				(listToken as Array<string>).forEach(addr=>{
					return Observable.fromPromise(this._walletContract.methods.clearTokenInfo(addr).send({gas:3000000 })
						.on('error', function(error){
							console.error(error);
							return Observable.of(false);
						})
						.on('receipt',function(receipt){
							console.log(receipt);
							return Observable.of(true);
						})
					);
				});
				return Observable.of(true);
			}).mergeMap(result=>{
				if(result){
					return Observable.fromPromise(this._walletContract.methods.clearToken().send({gas:3000000 })
						.on('error', function(error){
							console.error(error);
							return Observable.of(false);
						})
						.on('receipt',function(receipt){
							console.log("receipt: " + JSON.stringify(receipt));
							return Observable.of(true);
						})
					);
				}
			});
	}
}