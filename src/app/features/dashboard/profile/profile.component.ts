import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Balance } from 'src/app/shared/interfaces/balance';
import { BalanceService } from 'src/app/shared/services/balance.service';

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

  constructor(
    private authService: AuthService,
    private balanceService: BalanceService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUser()?.id;
      
      this.subscription = this.balanceService.getCurrentUserBalance(userId).subscribe(data => {
        const userData = data as User;
        if(userData.balance) {
          this.cryptoBalance = userData.balance;
          console.log(this.cryptoBalance);
          this.cdr.detectChanges();
        }
      })
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
