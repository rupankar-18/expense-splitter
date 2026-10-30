import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BalanceListComponent } from '../components/balance-list/balance-list.component';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';
import { ExpenseListComponent } from '../components/expense-list/expense-list.component';
import { MemberManagerComponent } from '../components/member-manager/member-manager.component';
import { SummaryCardComponent } from '../components/summary-card/summary-card.component';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    SummaryCardComponent,
    MemberManagerComponent,
    ExpenseFormComponent,
    BalanceListComponent,
    ExpenseListComponent,
    RouterLink,
  ],
  template: `
    <section class="page-shell">
      <div class="intro-row">
        <div>
          <p class="eyebrow">Shared Expense Splitter</p>
          <h2>Trip & Group Ledger</h2>
        </div>
        <a routerLink="/expenses" class="ghost-link">View Full History &rarr;</a>
      </div>

      <!-- Real-Time Metrics Calculated Dynamically -->
      <div class="summary-grid">
        <app-summary-card
          label="Total Spent"
          [value]="formatMoney(totalExpenses())"
          subtitle="Sum of all recorded expenses"
          accent="#7c3aed"
        />
        <app-summary-card
          label="Group Members"
          [value]="members().length.toString()"
          subtitle="Users splitting expenses"
          accent="#2563eb"
        />
        <app-summary-card
          label="Settlement Volume"
          [value]="formatMoney(netVolume())"
          subtitle="Total pending to be settled"
          accent="#059669"
        />
      </div>

      <!-- Top Row: Add Member & Add Expense Form -->
      <div class="content-grid">
        <div class="panel">
          <app-member-manager
            [members]="members()"
            (addMember)="handleAddMember($event)"
            (removeMember)="handleRemoveMember($event)"
          />
        </div>

        <div class="panel">
          <app-expense-form
            [members]="members()"
            (expenseAdded)="handleExpenseAdded($event)"
          />
        </div>
      </div>

      <!-- Bottom Row: Dynamic Balances & Recent Expenses -->
      <div class="content-grid">
        <div class="panel">
          <app-balance-list
            [members]="members()"
            [balances]="balances()"
          />
        </div>

        <div class="panel">
          <div class="panel-header">
            <div>
              <h3>Recent Expenses</h3>
              <p class="subtitle">Latest entries added</p>
            </div>
            <span class="count-tag">{{ expenses().length }} items</span>
          </div>
          <app-expense-list
            [expenses]="recentExpenses()"
            [members]="members()"
            (deleteExpense)="handleDeleteExpense($event)"
          />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-shell {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .intro-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .eyebrow {
        margin: 0 0 0.25rem;
        color: #7c3aed;
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 800;
      }

      h2 {
        margin: 0;
        color: #0f172a;
        font-size: clamp(1.8rem, 2.5vw, 2.4rem);
        font-weight: 800;
      }

      .ghost-link {
        color: #4f46e5;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.9rem;
        padding: 0.75rem 1.25rem;
        border-radius: 999px;
        background: rgba(79, 70, 229, 0.08);
        transition: all 0.2s ease;
      }

      .ghost-link:hover {
        background: rgba(79, 70, 229, 0.15);
      }

      .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.25rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }

      .panel {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 24px;
        padding: 1.25rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1.2rem;
      }

      .panel-header h3 {
        margin: 0;
        color: #0f172a;
        font-size: 1.15rem;
      }

      .subtitle {
        margin: 0.2rem 0 0;
        font-size: 0.8rem;
        color: #64748b;
      }

      .count-tag {
        color: #64748b;
        font-size: 0.75rem;
        font-weight: 700;
        background: #f1f5f9;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
      }

      @media (max-width: 900px) {
        .summary-grid,
        .content-grid {
          grid-template-columns: 1fr;
        }

        .intro-row {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class DashboardPageComponent {
  private readonly expenseService = inject(ExpenseService);

  readonly members = this.expenseService.members;
  readonly expenses = this.expenseService.expenses;
  readonly totalExpenses = this.expenseService.totalExpenses;
  readonly balances = this.expenseService.balances;

  readonly netVolume = computed(() => {
    return this.expenseService.netBalance().positive;
  });

  readonly recentExpenses = computed(() => {
    return this.expenses().slice(0, 5);
  });

  formatMoney(value: number) {
    return `₹${value.toFixed(2)}`;
  }

  handleAddMember(name: string) {
    this.expenseService.addMember(name);
  }

  handleRemoveMember(id: number) {
    this.expenseService.removeMember(id);
  }

  handleExpenseAdded(event: {
    title: string;
    amount: number;
    paidBy: number;
    category: string;
    splitBetween: number[];
  }) {
    this.expenseService.addExpense(event);
  }

  handleDeleteExpense(id: number) {
    this.expenseService.deleteExpense(id);
  }
}
