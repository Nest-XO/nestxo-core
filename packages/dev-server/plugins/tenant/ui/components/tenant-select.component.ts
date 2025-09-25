import { Component, OnInit } from '@angular/core';
import {
  DataService,
  FormInputComponent,
  RelationCustomFieldConfig,
  SharedModule,
} from '../../../../../admin-ui/src/lib/core/src/public_api';
import { FormControl, Validators } from '@angular/forms';
import { GET_TENANTS, GET_TENANT_BY_ID } from '../tenant-queries';
import { take } from 'rxjs/operators';

@Component({
  selector: 'vdr-tenant-select-input',
  template: `
    <div class="vendure-form-field vdr-select">
      <!-- Creation mode -->
      <select
        *ngIf="isCreation"
        [formControl]="formControl"
        class="form-control"
        [disabled]="readonly"
        required
        (focus)="onSelectFocus($event.target)"
      >
        <option [ngValue]="null" disabled>Select tenant</option>
        <option *ngFor="let t of tenants" [ngValue]="t">{{ t.name }}</option>
      </select>

      <!-- Update mode -->
      <input
        *ngIf="!isCreation"
        type="text"
        class="form-control"
        [value]="tenantName"
        readonly
      />
    </div>
  `,
  standalone: true,
  imports: [SharedModule],
})
export class TenantSelectInputComponent
  implements OnInit, FormInputComponent<RelationCustomFieldConfig>
{
  readonly: boolean;
  config: RelationCustomFieldConfig;
  formControl: FormControl;

  tenants: Array<{ id: string; name: string }> = [];
  isCreation = false;
  tenantName = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.formControl.addValidators([Validators.required]);

    console.log('[TenantSelect] Initial formControl value:', this.formControl.value);

    // Creation mode if formControl has no value yet
    this.isCreation = !this.formControl.value;

    if (this.isCreation) {
      // Load all tenants for dropdown
      this.dataService
        .query(GET_TENANTS)
        .mapStream((data: any) => data.tenants)
        .pipe(take(1))
        .subscribe((tenants) => {
          console.log('[TenantSelect] Loaded tenants:', tenants);
          this.tenants = tenants;
        });

      this.formControl.valueChanges.subscribe((val) => {
        console.log('[TenantSelect] FormControl changed ->', val);
      });
    } else {
      // Update mode: load the tenant object and set formControl.value
      let tenantId: string;
      if (typeof this.formControl.value === 'string') {
        tenantId = this.formControl.value;
      } else if (this.formControl.value && typeof this.formControl.value === 'object') {
        tenantId = this.formControl.value.id;
      } else {
        tenantId = '';
      }

      if (tenantId) {
        this.dataService
          .query(GET_TENANT_BY_ID, { id: tenantId })
          .mapStream((data: any) => data.tenant)
          .pipe(take(1))
          .subscribe((tenant) => {
            if (tenant) {
              console.log('[TenantSelect] Loaded tenant for update:', tenant);
              this.tenantName = tenant.name;
              this.formControl.setValue(tenant, { emitEvent: false }); // ✅ set full object
            }
          });
      }
    }
  }

  onTenantChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedTenant = this.tenants.find((t) => t.id === select.value);
    if (selectedTenant) {
      console.log('[TenantSelect] Tenant selected ->', selectedTenant);
      this.formControl.setValue(selectedTenant);
    }
  }

  onSelectFocus(target: EventTarget | null) {
    const select = target as HTMLSelectElement;
    if (select) {
      select.style.display = 'none';
      select.offsetHeight;
      select.style.display = '';
    }
  }
}
