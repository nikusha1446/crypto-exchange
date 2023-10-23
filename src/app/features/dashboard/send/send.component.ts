import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
import { Alert } from 'src/app/shared/interfaces/alert';
import { BalanceService } from 'src/app/shared/services/balance.service';
import { TransactionsService } from 'src/app/shared/services/transactions.service';

@Component({
  standalone: true,
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendComponent implements OnDestroy {
  private balanceSubscription: Subscription | undefined;
  private emailSubscription: Subscription | undefined;
  private changeBalanceSubscription: Subscription | undefined;
  private changeBalance2Subscription: Subscription | undefined;
  private sentSubscription: Subscription | undefined;
  alert: Alert | null = null;
  sendForm: FormGroup;
  currencies: {id: string, name: string}[] = [
    {'id': 'usd-coin', 'name': 'USDC'},
    {'id': 'bitcoin', 'name': 'Bitcoin'}, 
    {'id': 'ethereum', 'name': 'ETH'}, 
    {'id': 'binancecoin', 'name': 'BNB'}, 
    {'id': 'ripple', 'name': 'XRP'}, 
    {'id': 'solana', 'name': 'Solana'}, 
    {'id': 'cardano', 'name': 'Cardano'}
  ];

  constructor(
    private authService: AuthService,
    private balanceService: BalanceService,
    private transactionsService: TransactionsService,
    private cdr: ChangeDetectorRef ) {
    this.sendForm = new FormGroup({
      'asset': new FormControl('usd-coin', Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'amount': new FormControl(null, [Validators.required, Validators.pattern(/^(0*[1-9]\d*(\.\d+)?|0*\.\d+)$/)]),
    });
  }

  onSend() {
    const asset = this.sendForm.value.asset;
    const email = this.sendForm.value.email;
    const value = this.sendForm.value.amount * -1;
    const negativeBalance = { [asset]: value };
    const positiveBalance = { [asset]: value * -1 };

    const currentUser = this.authService.getCurrentUser();

    const sentTransaction = {
      userId: currentUser?.id,
      currency: asset,
      amount: value * -1,
      toEmail: email
    }

    if (currentUser) {
      this.balanceSubscription = this.balanceService.getCurrentUserBalance(currentUser.id).subscribe({
        next: (data) => {
          const userData = data as User
          if (userData.balance) {
            const payCurrency = userData.balance[asset as keyof typeof currentUser.balance];
            if (payCurrency < value * -1) {
              this.alert = {
                message: `You don't have enough ${asset}`,
                status: 'error'
              }
              this.cdr.detectChanges();
            } else {
              this.emailSubscription = this.balanceService.findUserWithEmail(email).subscribe({
                next: data => {
                  if(data) {
                    this.changeBalanceSubscription = this.balanceService.changeUserBalance(data, positiveBalance).subscribe({
                      next: data => {
                        this.changeBalance2Subscription = this.balanceService.changeUserBalance(currentUser?.id, negativeBalance).subscribe({
                          next: data => {
                            console.log(data);
                          },
                          error: error => {
                            console.error(error);
                          }
                        });
                      },
                      error: error => {
                        console.error(error);
                      }
                    })

                  this.sentSubscription = this.transactionsService.createSentTransaction(sentTransaction).subscribe({
                    next: data => {
                      console.log(data);
                      this.alert = {
                        message: `You've successfuly sent ${data.amount} ${this.getTicker(data.currency)} to ${data.toEmail}`,
                        status: 'success'
                      }
                      this.cdr.detectChanges();

                    },
                    error: error => {
                      console.error(error);
                    }
                  })
                
                  } else {
                    this.alert = {
                      message: 'No user found with this mail!',
                      status: 'error'
                    }
                    this.cdr.detectChanges();
                  }
                },
                error: error => {
                  console.error(error);
                }
            });
            }
          }
        },
        error: error => {
            console.error(error);
        }
      });
    }
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

  closeError() {
    this.alert = null;
  }

  ngOnDestroy() {
    this.balanceSubscription?.unsubscribe();
    this.emailSubscription?.unsubscribe();
    this.changeBalanceSubscription?.unsubscribe();
    this.changeBalance2Subscription?.unsubscribe();
    this.sentSubscription?.unsubscribe();
  }
}
