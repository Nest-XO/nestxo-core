import { addNavMenuItem, registerFormInputComponent } from '@vendure/admin-ui/core';
import { TenantSelectInputComponent } from './components/tenant-select.component';

export default [
  addNavMenuItem(
    {
      id: 'tenants',
      label: 'Tenants',
      routerLink: ['/extensions/tenants'],
      icon: 'organization',
      requiresPermission: 'SuperAdmin',
    },
    'settings',
    'sellers'
  ),

  registerFormInputComponent('tenant-select-input', TenantSelectInputComponent),
];
