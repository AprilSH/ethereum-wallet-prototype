# NgWallet

## Setup localhost

## Install geth  
npm install geth

## Initialize config for local Ethereum

Initialize the genesis.json 

geth --datadir %Folder Directory of data% init %Folder Directory%\genesis.json

Ex. geth --datadir "C:\NgWallet\Data" init "C:\NgWallet\config\genesis.json"

## Start geth service

* If you already have an account

geth --networkid "10" --ws --wsorigins "*" --nodiscover --datadir "%Folder path%" --rpc --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --rpcapi "eth,net,web3,personal" --targetgaslimit "20000000" --etherbase 0 --unlock 0 --preload "%Folder path%\worker.js" console

Ex. geth --networkid "10" --ws --wsorigins "*" --nodiscover --datadir "C:\NgWallet\Data" --rpc --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --rpcapi "eth,net,web3,personal" --targetgaslimit "20000000" --etherbase 0 --unlock 0 --preload "C:\NgWallet\config\worker.js" console

* If you don't have an account yet

	1. Create account

		Start geth  

		then execute personal.NewAccount()

		then enter passphrase for account

	2. then start network 
 
		geth --networkid "10" --ws --wsorigins "*" --nodiscover --datadir "%Folder path%" --rpc --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --rpcapi "eth,net,web3,personal" --targetgaslimit "20000000" --etherbase 0 --unlock 0 --preload "%Folder path%\worker.js" console

		Ex. geth --networkid "10" --ws --wsorigins "*" --nodiscover --datadir "C:\NgWallet\Data" --rpc --rpcaddr "localhost" --rpcport "8545" --rpccorsdomain "*" --rpcapi "eth,net,web3,personal" --targetgaslimit "20000000" --etherbase 0 --unlock 0 --preload "C:\NgWallet\config\worker.js" console

## Development server

* Open command line and go to NgWallet folder

	Run 'npm install' to retrieve dependency.

	Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

