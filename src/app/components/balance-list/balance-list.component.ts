import { Component, Input } from '@angular/core';
import { Member } from '../../expense.service';

@Component({
  selector: 'app-balance-list',
  standalone: true,
  template: `
    <div class="balance-card">
      <div class="header-row">
        <div>
          <h3>Net Balances</h3>
          <p class="subtitle">Calculated automatically per member</p>
        </div>
        <span class="pill">Settlement</span>
      </div>

      @for (entry of balances; track entry.id) {
        <div class="balance-row">
          <div class="member">
            <span class="avatar" [style.background]="getMemberColor(entry.id)">
              {{ getMemberInitials(entry.id) }}
            </span>
            <div>
              <strong>{{ getMemberName(entry.id) }}</strong>
              <small>
                Paid: ₹{{ entry.paid.toFixed(2) }} | Share: ₹{{ entry.owes.toFixed(2) }}
              </small>
            </div>
          </div>

          <div class="amount-wrap">
            <span
              class="amount"
              [class.positive]="entry.balance > 0.001"
              [class.negative]="entry.balance < -0.001"
              [class.settled]="Math.abs(entry.balance) <= 0.001"
            >
              {{ formatCurrency(entry.balance) }}
            </span>
            <span class="status-sub">
              @if (entry.balance > 0.001) {
                Gets back
              } @else if (entry.balance < -0.001) {
                Owes group
              } @else {
                Settled
              }
            </span>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
          No balances yet. Add members and save an expense to calculate balances!
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .balance-card {
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
        font-size: 1.15rem;
        color: #0f172a;
      }

      .subtitle {
        margin: 0.2rem 0 0;
        font-size: 0.8rem;
        color: #64748b;
      }

      .pill {
        background: rgba(34, 197, 94, 0.12);
        color: #15803d;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        font-size: 0.72rem;
        font-weight: 700;
      }

      .balance-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.85rem 0.2rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.15);
      }

      .balance-row:last-child {
        border-bottom: none;
      }

      .member {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .avatar {
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.75rem;
        font-weight: 700;
        flex-shrink: 0;
      }

      strong {
        display: block;
        color: #0f172a;
        font-size: 0.95rem;
      }

      small {
        color: #64748b;
        font-size: 0.75rem;
      }

      .amount-wrap {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .amount {
        font-weight: 800;
        font-size: 1rem;
      }

      .amount.positive {
        color: #16a34a;
      }

      .amount.negative {
        color: #dc2626;
      }

      .amount.settled {
        color: #64748b;
      }

      .status-sub {
        font-size: 0.7rem;
        font-weight: 600;
        color: #94a3b8;
      }

      .empty-state {
        color: #94a3b8;
        font-size: 0.85rem;
        text-align: center;
        padding: 1.5rem 0;
        font-style: italic;
      }
    `,
  ],
})
export class BalanceListComponent {
  @Input() members: Member[] = [];
  @Input() balances: Array<{ id: number; name: string; paid: number; owes: number; balance: number }> = [];

  readonly Math = Math;

  getMemberName(id: number) {
    return this.members.find((member) => member.id === id)?.name ?? 'Member';
  }

  getMemberColor(id: number) {
    return this.members.find((member) => member.id === id)?.color ?? '#64748b';
  }

  getMemberInitials(id: number) {
    return this.getMemberName(id).substring(0, 2).toUpperCase();
  }

  formatCurrency(value: number) {
    if (Math.abs(value) <= 0.001) {
      return '₹0.00';
    }
    const sign = value > 0 ? '+' : '-';
    return `${sign}₹${Math.abs(value).toFixed(2)}`;
  }
}
