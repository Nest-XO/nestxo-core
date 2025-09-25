// ui/components/tenant-create.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, SharedModule } from '../../../../../admin-ui/src/lib/core/src/public_api';
import { CREATE_TENANT } from '../tenant-queries';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'vdr-tenant-create',
  standalone: true,
  imports: [SharedModule, FormsModule],
  template: `
    <div class="button-container">
      <button class="button primary" (click)="createTenant()" [disabled]="!name || !description || !token">
        Create Tenant
      </button>
    </div>
    <vdr-page-block>
      <vdr-card title="Tenant Details">
        <div class="form-grid">
          <div class="form-group">
            <label for="name">Name</label>
            <input
              id="name"
              class="input"
              type="text"
              placeholder=""
              [(ngModel)]="name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="token">Token</label>
            <input
              id="token"
              class="input"
              type="text"
              placeholder=""
              [(ngModel)]="token"
              name="token"
              required
            />
          </div>

           <div class="form-group">
            <label for="description">Description</label>
            <input
              id="description"
              class="input"
              type="text"
              placeholder=""
              [(ngModel)]="description"
              name="description"
              required
            />
          </div>
        </div>
      </vdr-card>
    </vdr-page-block>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .input {
      padding: 0.5rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .button-container {
      display: flex;
      justify-content: flex-end; 
      margin: 1rem;       
    }
  `]
})
export class TenantCreateComponent {
  name = '';
  description = '';
  token = '';

  constructor(private dataService: DataService, private router: Router) {}

  createTenant() {
    if (!this.name || !this.description || !this.token) return;

    const variables = { name: this.name, description: this.description, token: this.token };
    this.dataService.mutate(CREATE_TENANT, variables).subscribe({
      next: () => this.router.navigate(['/extensions/tenants']),
      error: err => console.error('Error creating tenant', err),
    });
  }
}
