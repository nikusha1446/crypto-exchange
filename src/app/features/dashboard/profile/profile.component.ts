import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Balance } from 'src/app/shared/interfaces/balance';
import { Sent, Transaction } from 'src/app/shared/interfaces/transaction';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { TransactionsService } from 'src/app/shared/services/transactions.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  cryptoBalance: Balance = {};
  transactions: Transaction[] = [];
  sentTransactions: Sent[] = [];
  hasCryptoBalance: Boolean = false;

  constructor(
    private authService: AuthService,
    private balanceService: BalanceService,
    private transactionsService: TransactionsService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.id;
      
      this.subscription = this.balanceService.getCurrentUserBalance(userId).subscribe(data => {
        const userData = data as User;
        if(userData.balance) {
          this.cryptoBalance = userData.balance;

          for (const key in this.cryptoBalance) {
            if (this.cryptoBalance.hasOwnProperty(key) && this.cryptoBalance[key]! > 0) {
              this.hasCryptoBalance = true;
            }
          }
          
          console.log(this.cryptoBalance);
          this.cdr.detectChanges();
        }
      })

    if(userId) {
      this.transactionsService.getTransactionsById(userId).subscribe(data => {
        // console.log(data);
        this.transactions = data;
        console.log(this.transactions);
        this.cdr.detectChanges();
      })

      this.transactionsService.getSentTransactionsById(userId).subscribe(data => {
        // console.log(data);
        this.sentTransactions = data;
        console.log(this.transactions);
        this.cdr.detectChanges();
      })
    }

  }

  getName(crypto: string): string {
    const cryptoNames: { [key: string]: string } = {
      bitcoin: 'Bitcoin',
      'usd-coin': 'USDC',
      ethereum: 'Ethereum',
      binancecoin: 'BNB',
      ripple: 'XRP',
      solana: 'Solana',
      cardano: 'Cardano',
    };

    return cryptoNames[crypto] || crypto;
  }

  getTicker(crypto: string): string {
    const cryptoTickers: { [key: string]: string } = {
      bitcoin: 'BTC',
      'usd-coin': 'USDC',
      ethereum: 'ETH',
      binancecoin: 'BNB',
      ripple: 'XRP',
      solana: 'SOL',
      cardano: 'ADA',
    };

    return cryptoTickers[crypto] || crypto;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
