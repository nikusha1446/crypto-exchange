import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
export class CoinListComponent implements OnInit {
  coinList: Httpdata[] = [];

  constructor(private coinService: CoinService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.coinService.getCoinList().subscribe((data) => {
      console.log(data);
      this.coinList = data;
      this.cdr.detectChanges();
    })
  }

}
