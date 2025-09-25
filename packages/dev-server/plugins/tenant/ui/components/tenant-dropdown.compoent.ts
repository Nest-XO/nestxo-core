import { Component } from '@angular/core';
// import { SharedModule } from '@vendure/admin-ui/core';
import { SharedModule } from '../../../../../admin-ui/src/lib/core/src/public_api';

@Component({
  standalone: true,
  selector: 'tenant-select-input',
  imports: [SharedModule],
  template: `
    <div style="padding: 0 1rem; border-right: 1px solid #e0e0e0;">
      <p style="margin: 0; font-weight: bold; font-size: 14px;">Tenant Dropdown</p>
    </div>
  `,
})
export class TenantDropdownComponent {}


// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import {
//   DataService,
//   FormInputComponent,
//   InputComponentConfig,
//   SharedModule,
// } from '@vendure/admin-ui/core';
// import { GET_TENANTS } from '../tenant-queries';

// @Component({
//   standalone: true,
//   selector: 'tenant-select-input',
//   imports: [SharedModule],
//   template: `
//     <vdr-form-field [label]="'Tenant'" [for]="'tenant-select-input'">
//       <vdr-dropdown>
//         <button
//           type="button"
//           class="btn btn-outline w-full flex justify-between items-center"
//           vdrDropdownTrigger
//         >
//           {{ selectedTenant?.label || 'Select tenant' }}
//           <clr-icon shape="caret down"></clr-icon>
//         </button>
//         <vdr-dropdown-menu vdrPosition="bottom-left">
//           <button
//             *ngFor="let t of tenantOptions"
//             type="button"
//             vdrDropdownItem
//             (click)="selectTenant(t)"
//           >
//             {{ t.label }}
//           </button>
//         </vdr-dropdown-menu>
//       </vdr-dropdown>
//     </vdr-form-field>
//   `,
// })
// export class TenantDropdownComponent implements OnInit {
//   tenantOptions: { value: string; label: string }[] = [];
//   selectedTenant: { value: string; label: string } | null = null;
//   formControl = new FormControl();

//   constructor(private dataService: DataService) {}

//   ngOnInit() {
//     this.dataService.query<any>(GET_TENANTS).single$.subscribe(result => {
//       if (result.tenants) {
//         this.tenantOptions = result.tenants.map((t: any) => ({
//           value: t.id,
//           label: t.name,
//         }));
//       }
//     });

//     this.formControl.valueChanges.subscribe(value => {
//       this.selectedTenant =
//         this.tenantOptions.find(opt => opt.value === value) || null;
//     });
//   }

//   selectTenant(option: { value: string; label: string }) {
//     this.selectedTenant = option;
//     this.formControl.setValue(option.value);
//   }
// }