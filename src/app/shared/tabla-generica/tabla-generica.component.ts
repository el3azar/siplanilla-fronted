import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-generica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-generica.component.html',
  styleUrl: './tabla-generica.component.css'
})
export class TablaGenericaComponent {
  @Input() columnas: string[] = [];
  @Input() datos: any[] = [];
}
