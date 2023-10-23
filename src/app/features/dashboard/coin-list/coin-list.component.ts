import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoinService } from 'src/app/core/services/coin.service';
import { Httpdata } from 'src/app/shared/interfaces/httpdata';

@Component({
  standalone: true,
  selector: 'app-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoinListComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  errorMessage: string = '';
  coinList: Httpdata[] = [];

  constructor(private coinService: CoinService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscription = this.coinService.getCoinList().subscribe({
      next: (data) => {
        console.log(data);
        this.coinList = data;
        this.cdr.detectChanges();
      },
      error: error => {
        this.errorMessage = `Error occured: ${error.name}: ${error.status}`;
        console.log(error);
        
        this.cdr.detectChanges()
      }
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
