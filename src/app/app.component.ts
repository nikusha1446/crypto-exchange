import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [HeaderComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'final-project-angular';
}
