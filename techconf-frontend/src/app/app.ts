import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CharlaRegistroComponent } from './components/charla-registro/charla-registro';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [CharlaRegistroComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('techconf-frontend');
}
