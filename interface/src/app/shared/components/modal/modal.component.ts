import { Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalType } from '../../common/types/modal.type';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  public isOpen = model<boolean>(false);

  public title = input<string>('');
  public type = input<ModalType>('info');
  
  public preventCloseOnBackdrop = input<boolean>(false);

  public closed = output<void>();

  public iconColorClass = computed<string>(() => {
    switch (this.type()) {
      case 'success': return 'text-status-success';
      case 'error': return 'text-status-error';
      case 'warning': return 'text-yellow-500';
      case 'info':
      default: return 'text-crimson';
    }
  });

  public closeModal(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  public handleBackdropClick(): void {
    if (!this.preventCloseOnBackdrop()) {
      this.closeModal();
    }
  }

  public handleModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}