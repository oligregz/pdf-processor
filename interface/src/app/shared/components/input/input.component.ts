import { Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputType } from '../../common/types/input.type';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  public value = model<string>('');

  public label = input<string>('');
  public placeholder = input<string>('');
  public type = input<InputType>('text');
  public errorMessage = input<string | null>(null);
  public disabled = input<boolean>(false);
  
  public id = input<string>(`input-${crypto.randomUUID().split('-')[0]}`);

  public inputClasses = computed<string>(() => {
    const baseClasses = 'w-full px-4 py-3 bg-dark-surface border rounded-lg text-text-main placeholder-text-muted focus:outline-none transition-all duration-200';
    
    const stateClasses = this.errorMessage()
      ? 'border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error'
      : 'border-gray-800 focus:border-crimson focus:ring-1 focus:ring-crimson';
      
    const disabledClasses = this.disabled() 
      ? 'opacity-50 cursor-not-allowed bg-dark-bg' 
      : '';

    return `${baseClasses} ${stateClasses} ${disabledClasses}`.trim();
  });
}