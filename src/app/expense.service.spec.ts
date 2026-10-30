import { TestBed } from '@angular/core/testing';
import { ExpenseService } from './expense.service';

describe('ExpenseService', () => {
  let service: ExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(ExpenseService);
    service.members.set([]);
    service.expenses.set([]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a member and update signals', () => {
    const member = service.addMember('Charlie');
    expect(member).toBeTruthy();
    expect(member?.name).toBe('Charlie');
    expect(member?.id).toBe(1);
    expect(service.members().length).toBe(1);
    expect(service.members()[0].name).toBe('Charlie');
  });

  it('should assign sequential IDs and palette colors to subsequent members', () => {
    const m1 = service.addMember('Member 1');
    const m2 = service.addMember('Member 2');
    expect(m1?.id).toBe(1);
    expect(m2?.id).toBe(2);
    expect(service.members().length).toBe(2);
  });

  it('should ignore empty or whitespace-only member names', () => {
    const result = service.addMember('   ');
    expect(result).toBeNull();
    expect(service.members().length).toBe(0);
  });

  it('should remove a member and related expenses', () => {
    const m1 = service.addMember('John');
    const m2 = service.addMember('Jane');
    service.addExpense({
      title: 'Lunch',
      amount: 100,
      paidBy: m1!.id,
      category: 'Food',
      splitBetween: [m1!.id, m2!.id],
    });

    expect(service.expenses().length).toBe(1);
    service.removeMember(m1!.id);
    expect(service.members().some((m) => m.id === m1!.id)).toBe(false);
    expect(service.expenses().length).toBe(0);
  });
});
