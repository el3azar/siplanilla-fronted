import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appMaskDUI], [appMaskNIT]',
  standalone: true
})
export class InputMaskDirective {
  @Input() appMaskDUI: boolean = false;
  @Input() appMaskNIT: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Solo dígitos

    if (this.appMaskDUI) {
      value = this.formatDUI(value);
    } else if (this.appMaskNIT) {
      value = this.formatNIT(value);
    }

    // Actualizar el valor del input
    input.value = value;
    
    // Emitir evento para que Reactive Forms se entere del cambio
    const event_input = new Event('input', { bubbles: true });
    input.dispatchEvent(event_input);
    
    // También emitir change por si acaso
    const event_change = new Event('change', { bubbles: true });
    input.dispatchEvent(event_change);
  }

  private formatDUI(value: string): string {
    // Formato: 00000000-0 (8 dígitos, guion, 1 dígito)
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    if (value.length > 8) {
      return value.slice(0, 8) + '-' + value.slice(8);
    }
    return value;
  }

  private formatNIT(value: string): string {
    // Formato: 0000-000000-000-0 (4-6-3-1 dígitos)
    if (value.length > 14) {
      value = value.slice(0, 14);
    }
    if (value.length > 10) {
      return value.slice(0, 4) + '-' + value.slice(4, 10) + '-' + value.slice(10, 13) + '-' + value.slice(13);
    }
    if (value.length > 4) {
      return value.slice(0, 4) + '-' + value.slice(4, 10);
    }
    return value;
  }
}
