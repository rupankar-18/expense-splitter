import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Expense, Member } from '../../expense.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  template: `
    <div class="list-card">
      @for (item of expenses; track item.id) {
        <article class="expense-item">
          <div class="icon" [style.background]="getCategoryColor(item.category)">
            {{ getCategoryIcon(item.category) }}
          </div>

          <div class="details">
            <div class="meta-row">
              <strong>{{ item.title }}</strong>
              <span class="amount">₹{{ item.amount.toFixed(2) }}</span>
            </div>
            <div class="meta-row secondary">
              <span class="badge">{{ item.category }}</span>
              <span>Paid by <b>{{ getMemberName(item.paidBy) }}</b></span>
            </div>
            <div class="bottom-row">
              <small>{{ item.date }}</small>
              <button type="button" class="del-btn" (click)="deleteExpense.emit(item.id)">
                Delete
              </button>
            </div>
          </div>
        </article>
      } @empty {
        <div class="empty-state">
          <p>No expenses recorded yet.</p>
          <small>Add members and record your first expense above to calculate shares automatically!</small>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .list-card {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }

      .expense-item {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.95rem 1.1rem;
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        background: #ffffff;
        box-shadow: 0 4px 15px rgba(15, 23, 42, 0.02);
        transition: transform 0.15s ease;
      }

      .expense-item:hover {
        transform: translateY(-1px);
      }

      .icon {
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .details {
        flex: 1;
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .secondary {
        color: #64748b;
        font-size: 0.82rem;
        margin-top: 0.25rem;
      }

      .badge {
        background: #f1f5f9;
        padding: 0.15rem 0.5rem;
        border-radius: 6px;
        font-size: 0.72rem;
        font-weight: 600;
        color: #475569;
      }

      strong {
        color: #0f172a;
        font-size: 0.95rem;
      }

      .amount {
        font-weight: 800;
        color: #0f172a;
        font-size: 1rem;
      }

      .bottom-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.35rem;
      }

      small {
        color: #94a3b8;
        font-size: 0.75rem;
      }

      .del-btn {
        background: none;
        border: none;
        color: #ef4444;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        transition: background 0.15s;
      }

      .del-btn:hover {
        background: #fee2e2;
      }

      .empty-state {
        padding: 2rem 1.5rem;
        color: #64748b;
        border: 2px dashed rgba(148, 163, 184, 0.4);
        border-radius: 16px;
        text-align: center;
        background: rgba(255, 255, 255, 0.5);
      }

      .empty-state p {
        margin: 0 0 0.3rem;
        font-weight: 700;
        color: #334155;
      }
    `,
  ],
})
export class ExpenseListComponent {
  @Input() expenses: Expense[] = [];
  @Input() members: Member[] = [];
  @Output() deleteExpense = new EventEmitter<number>();

  getMemberName(id: number) {
    return this.members.find((member) => member.id === id)?.name ?? 'Unknown';
  }

  getCategoryIcon(cat: string) {
    switch (cat) {
      case 'Food': return '🍽️';
      case 'Travel': return '🚕';
      case 'Stay': return '🏨';
      case 'Shopping': return '🛍️';
      case 'Entertainment': return '🎟️';
      default: return '📦';
    }
  }

  getCategoryColor(cat: string) {
    switch (cat) {
      case 'Food': return 'rgba(239, 68, 68, 0.12)';
      case 'Travel': return 'rgba(59, 130, 246, 0.12)';
      case 'Stay': return 'rgba(168, 85, 247, 0.12)';
      case 'Shopping': return 'rgba(234, 88, 12, 0.12)';
      case 'Entertainment': return 'rgba(236, 72, 153, 0.12)';
      default: return 'rgba(100, 116, 139, 0.12)';
    }
  }
}
