import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { CoinService } from 'src/app/core/services/coin.service';
import { Alert } from 'src/app/shared/interfaces/alert';
import { Balance } from 'src/app/shared/interfaces/balance';
import { Httpdata } from 'src/app/shared/interfaces/httpdata';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { TransactionsService } from 'src/app/shared/services/transactions.service';

@Component({
  standalone: true,
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExchangeComponent implements OnInit, OnDestroy {
  coinList: Httpdata[] = [];
  alert: Alert | null = null;

  private coinListSubscription: Subscription | undefined;
  private depositSubscription: Subscription | undefined;
  private getBalanceSubscription: Subscription | undefined;
  private changeBalanceSubscription: Subscription | undefined;

  supportedCurrencies: {id: string, name: string}[] = [
    {'id': 'usd-coin', 'name': 'USDC'},
    {'id': 'bitcoin', 'name': 'Bitcoin'}, 
    {'id': 'ethereum', 'name': 'ETH'}, 
    {'id': 'binancecoin', 'name': 'BNB'}, 
    {'id': 'ripple', 'name': 'XRP'}, 
    {'id': 'solana', 'name': 'Solana'}, 
    {'id': 'cardano', 'name': 'Cardano'}
  ];

  activeSection: string = 'deposit';
  fiatValue: number = 0;

  payCurrency: string = 'usd-coin';
  receiveCurrency: string = 'bitcoin';
  amountToPay: number = 0;
  amountToReceive: number = 0;
  cryptoBalance: Balance = {};

  constructor(private authService: AuthService,
    private balanceService: BalanceService,
    private transactionService: TransactionsService,
    private coinService: CoinService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.coinListSubscription = this.coinService.getCoinList().subscribe((data) => {
      this.coinList = data;
    })
  }

  onDeposit() {
    const currentUser = this.authService.getCurrentUser();

    if(currentUser) {
      this.depositSubscription = this.balanceService.depositUSD(currentUser.id, this.fiatValue).subscribe({
        next: data => {
          console.log(data);
          this.alert = {
            message: `You've deposited $${this.fiatValue} USDC`,
            status: 'success'
          }
          this.cdr.detectChanges();
      },
        error: error => {
          console.error(error);
        }
      })
    }
  }

  onChangeAmount() {
    const payCrypto = this.coinList.find(coin => coin.id === this.payCurrency);
    const receiveCrypto = this.coinList.find(coin => coin.id === this.receiveCurrency);
  
    if (payCrypto && receiveCrypto && payCrypto.current_price && receiveCrypto.current_price) {
      this.amountToReceive = (this.amountToPay * payCrypto.current_price) / receiveCrypto.current_price;
    }
  }

  onChangeAmount2() {
    const payCrypto = this.coinList.find(coin => coin.id === this.payCurrency);
    const receiveCrypto = this.coinList.find(coin => coin.id === this.receiveCurrency);
  
    if (payCrypto && receiveCrypto && payCrypto.current_price && receiveCrypto.current_price) {
      this.amountToPay = (this.amountToReceive * receiveCrypto.current_price) / payCrypto.current_price;
    }
  }

  isConvertionValid() {
    return this.amountToPay <= 0 || this.amountToReceive <= 0 || this.payCurrency === this.receiveCurrency;
  }

  onConvert() {
    const currentUser = this.authService.getCurrentUser();
    this.cryptoBalance = {
      [this.payCurrency]: this.amountToPay * -1,
      [this.receiveCurrency]: this.amountToReceive,
    };

    const transaction = {
      userId: currentUser?.id,
      fromCurrency: this.payCurrency,
      toCurrency: this.receiveCurrency,
      amountFrom: this.amountToPay,
      amountTo: this.amountToReceive
    }
  
    if (currentUser) {
      this.getBalanceSubscription = this.balanceService.getCurrentUserBalance(currentUser.id).subscribe({
        next: (data) => {
          const userData = data as User
          if (userData.balance) {
            const payCurrencyAmount = userData.balance[this.payCurrency as keyof typeof currentUser.balance];
            if (payCurrencyAmount < this.amountToPay) {
              this.alert = {
                message: `You don't have enough ${this.payCurrency}`,
                status: 'error'
              }
              this.cdr.detectChanges();
            } else {
              this.changeBalanceSubscription = this.balanceService.changeUserBalance(currentUser.id, this.cryptoBalance).subscribe({
                next: data => {
                  this.alert = {
                    message: `Your transaction was successfull!`,
                    status: 'success'
                  }
                  this.cdr.detectChanges();
                },
                error: error => {
                  console.error(error);
                }
              });

              this.transactionService.createTransaction(transaction).subscribe({
                next: data => {

                },
                error: error => {
                  console.error(error);
                }
              })
            }
          }
        },
        error: error => {
          console.error(error);
          
        }
      });
    }
  }

  closeError() {
    this.alert = null;
  }

  ngOnDestroy(): void {
    this.coinListSubscription?.unsubscribe();
    this.depositSubscription?.unsubscribe();
    this.getBalanceSubscription?.unsubscribe();
    this.changeBalanceSubscription?.unsubscribe();
  }
}