import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../expense.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="form-card">
      <div class="header-row">
        <div>
          <h3>Add Expense</h3>
          <p class="subtitle">Record an expense & split automatically</p>
        </div>
        <span class="tag">Equal split</span>
      </div>

      @if (members.length === 0) {
        <div class="warning-box">
          ⚠️ Please add group members first before recording an expense.
        </div>
      } @else {
        <form [formGroup]="form" (ngSubmit)="submitForm()">
          <label>
            Expense Title
            <input formControlName="title" type="text" placeholder="e.g. Dinner, Taxi, Groceries" />
          </label>

          <div class="two-col">
            <label>
              Amount (₹)
              <input formControlName="amount" type="number" min="1" step="any" placeholder="0.00" />
            </label>

            <label>
              Paid By
              <select formControlName="paidBy">
                @for (member of members; track member.id) {
                  <option [ngValue]="member.id">{{ member.name }}</option>
                }
              </select>
            </label>
          </div>

          <label>
            Category
            <select formControlName="category">
              <option value="Food">🍽️ Food & Dining</option>
              <option value="Travel">🚕 Travel & Transport</option>
              <option value="Stay">🏨 Accommodation</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Entertainment">🎟️ Entertainment</option>
              <option value="Other">📦 Other</option>
            </select>
          </label>

          @if (form.value.amount && form.value.amount > 0 && members.length > 0) {
            <div class="split-preview">
              <span>Split per person:</span>
              <strong>₹{{ (form.value.amount / members.length).toFixed(2) }}</strong>
              <small>({{ members.length }} people)</small>
            </div>
          }

          <button type="submit" [disabled]="form.invalid || members.length === 0">
            Save Expense
          </button>
        </form>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .form-card {
        background: #fff;
        border: 1px solid rgba(148, 163, 184, 0.18);
        border-radius: 20px;
        padding: 1.25rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.2rem;
      }

      h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.15rem;
      }

      .subtitle {
        margin: 0.2rem 0 0;
        font-size: 0.8rem;
        color: #64748b;
      }

      .tag {
        font-size: 0.72rem;
        background: rgba(124, 58, 237, 0.1);
        color: #6d28d9;
        border-radius: 999px;
        padding: 0.3rem 0.65rem;
        font-weight: 700;
      }

      .warning-box {
        background: #fffbeb;
        border: 1px solid #fde68a;
        color: #b45309;
        border-radius: 12px;
        padding: 1.2rem;
        font-size: 0.9rem;
        text-align: center;
        line-height: 1.4;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        color: #334155;
        font-size: 0.82rem;
        font-weight: 600;
      }

      input,
      select {
        border: 1px solid rgba(148, 163, 184, 0.5);
        border-radius: 12px;
        padding: 0.8rem 0.9rem;
        font: inherit;
        background: #f8fafc;
        color: #0f172a;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      input:focus,
      select:focus {
        outline: none;
        border-color: #8b5cf6;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }

      .two-col {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .split-preview {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(124, 58, 237, 0.05);
        border: 1px dashed rgba(124, 58, 237, 0.3);
        padding: 0.6rem 0.9rem;
        border-radius: 10px;
        font-size: 0.85rem;
        color: #4c1d95;
      }

      .split-preview strong {
        color: #7c3aed;
        font-size: 1rem;
      }

      .split-preview small {
        color: #64748b;
      }

      button {
        margin-top: 0.25rem;
        border: 0;
        border-radius: 12px;
        background: linear-gradient(135deg, #7c3aed, #4f46e5);
        color: white;
        font-weight: 700;
        padding: 0.9rem 1rem;
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s;
      }

      button:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      @media (max-width: 640px) {
        .two-col {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ExpenseFormComponent implements OnChanges {
  @Input() members: Member[] = [];
  @Output() expenseAdded = new EventEmitter<{
    title: string;
    amount: number;
    paidBy: number;
    category: string;
    splitBetween: number[];
  }>();

  private fb = new FormBuilder();

  form = this.fb.group({
    title: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    paidBy: [null as number | null, Validators.required],
    category: ['Food', Validators.required],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['members'] && this.members.length > 0) {
      const currentPaidBy = this.form.get('paidBy')?.value;
      const exists = this.members.some((m) => m.id === currentPaidBy);
      if (!exists || currentPaidBy === null) {
        this.form.patchValue({ paidBy: this.members[0].id });
      }
    }
  }

  submitForm() {
    if (this.form.invalid || this.members.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, amount, paidBy, category } = this.form.getRawValue();

    this.expenseAdded.emit({
      title: title || '',
      amount: Number(amount),
      paidBy: paidBy!,
      category: category || 'Other',
      splitBetween: this.members.map((member) => member.id),
    });

    this.form.reset({
      title: '',
      amount: null,
      paidBy: this.members[0]?.id ?? null,
      category: 'Food',
    });
  }
}
