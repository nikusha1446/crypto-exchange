import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [SidebarComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {

}
