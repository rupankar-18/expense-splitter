import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  template: `
    <div class="summary-card" [style.--accent]="accent">
      <span class="label">{{ label }}</span>
      <strong>{{ value }}</strong>
      <small>{{ subtitle }}</small>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .summary-card {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(15, 23, 42, 0.04));
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 18px;
        padding: 1.15rem 1.2rem;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
      }

      .label {
        color: #64748b;
        font-size: 0.78rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      strong {
        font-size: clamp(1.5rem, 2vw, 2.2rem);
        color: #0f172a;
      }

      small {
        color: #475569;
        font-size: 0.85rem;
      }
    `,
  ],
})
export class SummaryCardComponent {
  @Input() label = 'Total';
  @Input() value = '₹0';
  @Input() subtitle = 'summary';
  @Input() accent = '#7c3aed';
}
