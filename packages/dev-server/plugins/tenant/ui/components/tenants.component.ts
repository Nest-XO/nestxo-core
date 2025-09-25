import { Component } from '@angular/core';
import { DataService, SharedModule } from '../../../../../admin-ui/src/lib/core/src/public_api';
import { GET_TENANTS } from '../tenant-queries';
import { Observable } from 'rxjs';

@Component({
  selector: 'vdr-tenants',
  standalone: true,
  imports: [SharedModule],
  template: `
     <div class="button-container">
      <button
          class="button primary"
          [routerLink]="['/extensions/tenants/create']"
        >
          <clr-icon shape="plus"></clr-icon>
          create new tenant
        </button>
    </div>

    <!-- Page body -->
    <vdr-page-block>
      <vdr-data-table-2
        id="tenant-table"
        [items]="tenants$ | async"
        [itemsPerPage]="itemsPerPage"
        [totalItems]="totalItems"
        [currentPage]="1"
        emptyStateLabel="No tenants found"
      >
        <vdr-dt2-column [heading]="'Name'">
          <ng-template let-tenant="item">
            <a class="button-ghost" [routerLink]="['/extensions/tenants', tenant.id]">
              <span>{{ tenant.name }}</span>
              <clr-icon shape="arrow right"></clr-icon>
            </a>
          </ng-template>
        </vdr-dt2-column>

        <vdr-dt2-column [heading]="'Code'">
          <ng-template let-tenant="item">
            {{ tenant.code }}
          </ng-template>
        </vdr-dt2-column>

        <vdr-dt2-column [heading]="'Token'">
          <ng-template let-tenant="item">
            {{ tenant.token }}
          </ng-template>
        </vdr-dt2-column>
      </vdr-data-table-2>
    </vdr-page-block>
  `,
  styles: [
    `.button-container {
      display: flex;
      justify-content: flex-end; 
      margin: .5rem;       
    }`
  ]
})
export class TenantsComponent {
  tenants$: Observable<any[]>;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private dataService: DataService) {
    this.tenants$ = this.dataService.query(GET_TENANTS).mapStream((res: any) => {
      this.totalItems = res.tenants.length;
      return res.tenants;
    });
  }
}
