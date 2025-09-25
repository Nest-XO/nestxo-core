import { registerRouteComponent } from '@vendure/admin-ui/core';
import { TenantsComponent } from './components/tenants.component';
import { TenantCreateComponent } from './components/tenant-create.component';

export default [
  registerRouteComponent({
    component: TenantsComponent,
    path: '',
    title: 'Tenants',
  }),
  registerRouteComponent({
    component: TenantCreateComponent,
    path: 'create', // create page
    title: 'Create Tenant',
  }),
];
