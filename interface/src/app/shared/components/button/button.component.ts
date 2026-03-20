import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonType, ButtonVariantType } from '../../common/types/button.type';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  public variant = input<ButtonVariantType>('primary');
  public type = input<ButtonType>('button');
  
  public disabled = input<boolean>(false);
  public isLoading = input<boolean>(false);
  public fullWidth = input<boolean>(false);

  public onClick = output<MouseEvent>();

  public buttonClasses = computed<string>(() => {
    const baseClasses = 'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg overflow-hidden';
    
    const widthClass = this.fullWidth() ? 'w-full' : '';

    const stateClasses = (this.disabled() || this.isLoading())
      ? 'opacity-60 cursor-not-allowed'
      : 'active:scale-[0.98]';

    let variantClasses = '';
    switch (this.variant()) {
      case 'primary':
        variantClasses = 'bg-crimson text-white hover:bg-crimson-hover focus:ring-crimson border border-transparent';
        break;
      case 'secondary':
        variantClasses = 'bg-dark-surface text-text-main border border-gray-700 hover:border-gray-500 focus:ring-gray-500';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent text-text-main hover:bg-dark-surface focus:ring-gray-600 border border-transparent';
        break;
    }

    return `${baseClasses} ${widthClass} ${stateClasses} ${variantClasses}`.trim();
  });

  public handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.isLoading()) {
      this.onClick.emit(event);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}