import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExpenseFormComponent } from '../components/expense-form/expense-form.component';
import { ExpenseListComponent } from '../components/expense-list/expense-list.component';
import { MemberManagerComponent } from '../components/member-manager/member-manager.component';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [MemberManagerComponent, ExpenseFormComponent, ExpenseListComponent, RouterLink],
  template: `
    <section class="page-shell">
      <div class="intro-row">
        <div>
          <p class="eyebrow">Transaction Records</p>
          <h2>All Expense Logs</h2>
        </div>
        <a routerLink="/dashboard" class="ghost-link">&larr; Back to Dashboard</a>
      </div>

      <div class="content-grid">
        <div class="left-col">
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

        <div class="panel full-list">
          <div class="panel-header">
            <div>
              <h3>All Recorded Expenses</h3>
              <p class="subtitle">Complete history of group payments</p>
            </div>
            <span class="count-tag">{{ expenses().length }} total</span>
          </div>
          <app-expense-list
            [expenses]="expenses()"
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

      .content-grid {
        display: grid;
        grid-template-columns: 1fr 1.25fr;
        gap: 1.25rem;
      }

      .left-col {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .panel {
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 24px;
        padding: 1.25rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.03);
      }

      .full-list {
        min-height: 440px;
      }

      .panel-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
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
export class ExpensesPageComponent {
  private readonly expenseService = inject(ExpenseService);

  readonly members = this.expenseService.members;
  readonly expenses = this.expenseService.expenses;

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
