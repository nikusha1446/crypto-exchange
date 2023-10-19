import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CoinListComponent } from './coin-list/coin-list.component';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [SidebarComponent, CoinListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

}
