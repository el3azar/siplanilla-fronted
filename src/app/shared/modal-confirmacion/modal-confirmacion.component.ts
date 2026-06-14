import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirmacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-confirmacion.component.html',
  styleUrl: './modal-confirmacion.component.css'
})
export class ModalConfirmacionComponent {
  @Input() titulo: string = '¿Confirmar acción?';
  @Input() mensaje: string = '¿Está seguro de continuar?';
  @Output() confirmado = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();
}
