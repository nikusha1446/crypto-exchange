import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth.service';
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
    private transactionsService: TransactionsService ) {
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
      this.balanceSubscription = this.balanceService.getCurrentUserBalance(currentUser.id).subscribe((data) => {
        const userData = data as User
        if (userData.balance) {
          const payCurrency = userData.balance[asset as keyof typeof currentUser.balance];
          if (payCurrency < value * -1) {
            console.log(`You don't have enough ${asset}`);
          } else {

            this.emailSubscription = this.balanceService.findUserWithEmail(email).subscribe(data => {
              if(data) {
                this.changeBalanceSubscription = this.balanceService.changeUserBalance(data, positiveBalance).subscribe(data => {
                  this.changeBalance2Subscription = this.balanceService.changeUserBalance(currentUser?.id, negativeBalance).subscribe(data => {
                    console.log(data);
                  });
                })

                this.sentSubscription = this.transactionsService.createSentTransaction(sentTransaction).subscribe(data => {
                  console.log(data);
                  
                })
                
              } else {
                console.log('No user found with this mail!');
                
              }
            });
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.balanceSubscription?.unsubscribe();
    this.emailSubscription?.unsubscribe();
    this.changeBalanceSubscription?.unsubscribe();
    this.changeBalance2Subscription?.unsubscribe();
    this.sentSubscription?.unsubscribe();
  }
}
