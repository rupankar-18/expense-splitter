import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Member } from '../../expense.service';

@Component({
  selector: 'app-member-manager',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="member-card">
      <div class="header-row">
        <div>
          <h3>Group Members</h3>
          <p class="subtitle">Add participants to split expenses with</p>
        </div>
        <span class="count-badge">{{ members.length }} active</span>
      </div>

      <form (submit)="handleAdd($event)" class="input-form">
        <div class="input-wrap">
          <input
            [formControl]="nameControl"
            type="text"
            placeholder="Enter member name (e.g. Alex, Maya)"
            maxlength="30"
            (keydown.enter)="handleAdd($event)"
          />
          <button
            type="button"
            (click)="handleAdd($event)"
            [disabled]="isInvalid"
          >
            + Add
          </button>
        </div>
        @if (errorMessage) {
          <small class="error-msg">{{ errorMessage }}</small>
        }
      </form>

      <div class="chips-container">
        @for (member of members; track member.id) {
          <div class="member-chip" [style.--chip-color]="member.color">
            <span class="avatar">{{ member.name.slice(0, 2).toUpperCase() }}</span>
            <span class="name">{{ member.name }}</span>
            <button
              type="button"
              class="remove-btn"
              (click)="removeMember.emit(member.id)"
              title="Remove member"
            >
              &times;
            </button>
          </div>
        } @empty {
          <div class="empty-hint">
            No members added yet. Add participants above to begin logging expenses!
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .member-card {
        background: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 20px;
        padding: 1.25rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
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

      .count-badge {
        font-size: 0.75rem;
        font-weight: 700;
        background: rgba(124, 58, 237, 0.1);
        color: #7c3aed;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
      }

      .input-form {
        margin-bottom: 1rem;
      }

      .input-wrap {
        display: flex;
        gap: 0.5rem;
      }

      input {
        flex: 1;
        border: 1px solid rgba(148, 163, 184, 0.5);
        border-radius: 12px;
        padding: 0.75rem 0.9rem;
        font: inherit;
        background: #f8fafc;
        color: #0f172a;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      input:focus {
        outline: none;
        border-color: #7c3aed;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
      }

      button[type='submit'] {
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #7c3aed, #4f46e5);
        color: #fff;
        font-weight: 700;
        padding: 0 1.2rem;
        cursor: pointer;
        transition: transform 0.15s, opacity 0.15s;
      }

      button[type='submit']:hover:not(:disabled) {
        transform: translateY(-1px);
      }

      button[type='submit']:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .error-msg {
        color: #dc2626;
        font-size: 0.75rem;
        margin-top: 0.25rem;
        display: block;
      }

      .chips-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
      }

      .member-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.35rem 0.65rem 0.35rem 0.45rem;
        background: #f1f5f9;
        border: 1px solid rgba(148, 163, 184, 0.3);
        border-radius: 999px;
        font-size: 0.85rem;
        color: #1e293b;
      }

      .avatar {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: var(--chip-color, #7c3aed);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .name {
        font-weight: 600;
      }

      .remove-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 1.1rem;
        line-height: 1;
        cursor: pointer;
        padding: 0 0.15rem;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: color 0.15s;
      }

      .remove-btn:hover {
        color: #dc2626;
      }

      .empty-hint {
        color: #94a3b8;
        font-size: 0.82rem;
        font-style: italic;
        padding: 0.5rem 0;
      }
    `,
  ],
})
export class MemberManagerComponent {
  @Input() members: Member[] = [];
  @Output() addMember = new EventEmitter<string>();
  @Output() removeMember = new EventEmitter<number>();

  nameControl = new FormControl('', {
    nonNullable: true,
  });

  errorMessage = '';

  get isInvalid(): boolean {
    return !this.nameControl.value || this.nameControl.value.trim().length === 0;
  }

  handleAdd(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.errorMessage = '';
    const val = this.nameControl.value?.trim() || '';
    if (!val) {
      this.errorMessage = 'Please enter a name.';
      return;
    }

    const duplicate = this.members.some(
      (m) => m.name.toLowerCase() === val.toLowerCase(),
    );
    if (duplicate) {
      this.errorMessage = `"${val}" is already added.`;
      return;
    }

    this.addMember.emit(val);
    this.nameControl.setValue('');
    this.nameControl.markAsPristine();
    this.nameControl.markAsUntouched();
    this.errorMessage = '';
  }
}
