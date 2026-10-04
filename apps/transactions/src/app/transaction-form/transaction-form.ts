import { Component, signal, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionsApiService, Transaction } from '@financial-dashboard/shared-transactions';
import { EventBusService } from '@financial-dashboard/shared-core';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.scss',
})
export class TransactionForm {
  private readonly transactionsApi = inject(TransactionsApiService);
  private readonly fb = inject(FormBuilder);
  private readonly eventBus = inject(EventBusService);

  readonly created = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['expense' as Transaction['type'], Validators.required],
    category: ['', Validators.required],
    description: [''],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
  });

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.transactionsApi.create(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.form.reset({
          amount: 0,
          type: 'expense',
          category: '',
          description: '',
          date: new Date().toISOString().slice(0, 10),
        });
        this.created.emit();
        this.eventBus.emit({ type: 'transaction-created' });
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err.error?.message ?? 'Error al crear la transacción');
      },
    });
  }
}