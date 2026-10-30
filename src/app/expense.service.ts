import { computed, Injectable, signal } from '@angular/core';

export interface Member {
  id: number;
  name: string;
  color: string;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  paidBy: number;
  category: string;
  date: string;
  splitBetween: number[];
}

const PALETTE = [
  '#7c3aed',
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#db2777',
  '#0891b2',
  '#4f46e5',
];

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

const STORAGE_KEY_MEMBERS = 'trip_ledger_members';
const STORAGE_KEY_EXPENSES = 'trip_ledger_expenses';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  readonly members = signal<Member[]>(loadFromStorage(STORAGE_KEY_MEMBERS, []));
  readonly expenses = signal<Expense[]>(loadFromStorage(STORAGE_KEY_EXPENSES, []));

  readonly totalExpenses = computed(() =>
    this.expenses().reduce((sum, expense) => sum + expense.amount, 0),
  );

  readonly balances = computed(() => {
    const memberList = this.members();
    const summary = memberList.map((member) => ({
      id: member.id,
      name: member.name,
      paid: 0,
      owes: 0,
      balance: 0,
    }));

    this.expenses().forEach((expense) => {
      const payer = summary.find((entry) => entry.id === expense.paidBy);
      if (payer) {
        payer.paid += expense.amount;
      }

      const splitTargets =
        expense.splitBetween && expense.splitBetween.length > 0
          ? expense.splitBetween
          : memberList.map((m) => m.id);

      const count = Math.max(1, splitTargets.length);
      const share = expense.amount / count;

      splitTargets.forEach((memberId) => {
        const member = summary.find((entry) => entry.id === memberId);
        if (member) {
          member.owes += share;
        }
      });
    });

    return summary.map((member) => ({
      ...member,
      balance: member.paid - member.owes,
    }));
  });

  readonly netBalance = computed(() => {
    const positive = this.balances().filter((entry) => entry.balance > 0);
    const negative = this.balances().filter((entry) => entry.balance < 0);
    return {
      positive: positive.reduce((sum, entry) => sum + entry.balance, 0),
      negative: Math.abs(negative.reduce((sum, entry) => sum + entry.balance, 0)),
    };
  });

  addMember(name: string): Member | null {
    const trimmed = name?.trim();
    if (!trimmed) {
      return null;
    }

    const currentMembers = this.members();
    const nextId = currentMembers.length > 0
      ? Math.max(...currentMembers.map((m) => m.id)) + 1
      : 1;

    const color = PALETTE[(nextId - 1) % PALETTE.length];
    const newMember: Member = {
      id: nextId,
      name: trimmed,
      color,
    };

    this.members.update((current) => {
      const updated = [...current, newMember];
      saveToStorage(STORAGE_KEY_MEMBERS, updated);
      return updated;
    });
    return newMember;
  }

  removeMember(id: number) {
    this.members.update((current) => {
      const updated = current.filter((m) => m.id !== id);
      saveToStorage(STORAGE_KEY_MEMBERS, updated);
      return updated;
    });
    // also remove expenses paid by this member or sanitize
    this.expenses.update((current) => {
      const updated = current.filter((e) => e.paidBy !== id);
      saveToStorage(STORAGE_KEY_EXPENSES, updated);
      return updated;
    });
  }

  addExpense(details: Omit<Expense, 'id' | 'date'>) {
    const split =
      details.splitBetween && details.splitBetween.length > 0
        ? details.splitBetween
        : this.members().map((member) => member.id);

    const nextExpense: Expense = {
      ...details,
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      splitBetween: split,
    };

    this.expenses.update((current) => {
      const updated = [nextExpense, ...current];
      saveToStorage(STORAGE_KEY_EXPENSES, updated);
      return updated;
    });
  }

  deleteExpense(id: number) {
    this.expenses.update((current) => {
      const updated = current.filter((e) => e.id !== id);
      saveToStorage(STORAGE_KEY_EXPENSES, updated);
      return updated;
    });
  }

  clearAll() {
    this.expenses.set([]);
    saveToStorage(STORAGE_KEY_EXPENSES, []);
  }
}
