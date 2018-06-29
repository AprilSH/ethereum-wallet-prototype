pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

contract WalletContract {
    
    struct Account{
        string email;
        address acctAddr;
        string acctKey;
        bool isExist;
    }
    
    struct Token{
        string tokenName;
        string tokenSymbol;
        bool isExist;
    }
    
    mapping(string=>Account) listAccount;
    mapping(address=>Token) listToken;
    address[] private listAddress;
    address[] private listTokenAddress;
    string[] private listEmail;
    uint listCount;
    
    // Check if Email exists on registered accounts
    function isEmailExist(string email) public view returns(bool isExists){
        if(listAccount[email].isExist){
            return true;
        }
        return false;
    } 
    
    // Register Account 
    function registerAccount(string email,address acctAddr,string acctKey) public returns(bool isSuccess,string errMsg){
        if(listAccount[email].isExist){
            return (false,'Account email already exists');
        }else{
            Account memory acct = Account(email,acctAddr,acctKey,true);
            listAccount[email] = acct;
            listAddress.push(acctAddr);
            listEmail.push(email);
            return (true,'');
        }
        listCount++;
    }
    
    function getAccountByEmail(string email) public view returns(string aEmail,address aAcctAddr,string aAcctKey){
        if(isEmailExist(email)){
            return (email,listAccount[email].acctAddr,listAccount[email].acctKey);
        }else{
            address emptyAddr = address(0);
            return ('',emptyAddr,'');
        }
    }
    
    function transferFunds(string email)public payable {
        listAccount[email].acctAddr.transfer(msg.value);
    }
    
    function getAccountByAddress(address _addr) public view returns(string email) {
        for(uint i = 0;i < listAddress.length;i++){
            if(listAddress[i] == _addr){
                return listEmail[i];
            }
        }
    }
    
    function getListAccount() public view returns(address[] accountList) {
        return listAddress;
    }
    
    // Check ifToken exists
    function isTokenExist(address _address) public view returns(bool exists){
        return listToken[_address].isExist;
    } 
    
    function addToken(address _tokenAddress, string _tokenName, string _tokenSymbol) public returns (bool isSuccess){
        listTokenAddress.push(_tokenAddress);
        Token memory tkn = Token(_tokenName,_tokenSymbol,true);
        listToken[_tokenAddress] = tkn;
        return true;
    }
    
    function getListToken() public view returns (address[]) {
        return listTokenAddress;
    }
    
    function getTokenInfo(address _tokenAddress) public view returns (string name, string symbol){
        return (listToken[_tokenAddress].tokenName,listToken[_tokenAddress].tokenSymbol);
    }
    
    function clearToken() public returns (bool){
        delete listTokenAddress;
        return true;
    }
    
    function clearTokenInfo(address _tokenAddress) public returns (bool){
        delete listToken[_tokenAddress];
        return true;
    }
    
    
    

}