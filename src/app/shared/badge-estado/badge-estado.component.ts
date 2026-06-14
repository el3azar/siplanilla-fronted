import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge-estado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge-estado.component.html',
  styleUrl: './badge-estado.component.css'
})
export class BadgeEstadoComponent {
  @Input() estado: boolean | number = false;
}
