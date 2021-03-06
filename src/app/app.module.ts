import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule,Routes} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { RegisterComponent } from './wallet/components/RegisterComponent';
import { ImportComponent } from './wallet/components/ImportComponent';
import { TransferComponent } from './wallet/components/TransferComponent';
import { ExtractKeyComponent } from './wallet/components/ExtractKeyComponent';
import { AccountListComponent } from './wallet/components/AccountListComponent';
import { WalletContractService } from './wallet/WalletContractService';
import { WalletComponent } from './wallet/components/WalletComponent'; 
import { DetailComponent} from './wallet/components/DetailComponent';

const routes : Routes = [
  { path : 'wallet', component : WalletComponent},
  { path : '', redirectTo : 'wallet', pathMatch : 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
  RegisterComponent,
  ImportComponent,
  TransferComponent,
  ExtractKeyComponent,
  AccountListComponent,
  DetailComponent,
	WalletComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
	  RouterModule.forRoot(routes)  
  ],
  providers: [WalletContractService],
  bootstrap: [AppComponent]
})
export class AppModule { }
 