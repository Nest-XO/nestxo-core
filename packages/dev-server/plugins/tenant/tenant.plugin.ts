import { VendurePlugin, PluginCommonModule } from '@vendure/core';
import { Tenant } from './tenant.entity';
import { TenantService } from './tenant.service';
import { TenantResolver } from './tenant.resolver';
import { tenantAdminSchema } from './tenant.graphql';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import * as path from 'path';

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [TenantService],
  entities: [Tenant],
  adminApiExtensions: {
    schema: tenantAdminSchema,
    resolvers: [TenantResolver],
  },
})
export class TenantPlugin {
 static ui: AdminUiExtension = {
    id: 'tenant-ui',
    extensionPath: path.join(__dirname, 'ui'),
    routes: [
      {
        route: 'tenants',
        filePath: 'routes.ts',
      },
    ],
    providers: ['providers.ts'],
  }
}


// import { VendurePlugin, PluginCommonModule } from '@vendure/core';
// import { Tenant } from './tenant.entity';
// import { TenantService } from './tenant.service';
// import { TenantResolver } from './tenant.resolver';
// import { tenantAdminSchema } from './tenant.graphql';
// import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
// import * as path from 'path';

// @VendurePlugin({
//   imports: [PluginCommonModule],
//   providers: [TenantService],
//   entities: [Tenant],
//   adminApiExtensions: {
//     schema: tenantAdminSchema,
//     resolvers: [TenantResolver],
//   },
// })
// export class TenantPlugin {
//  static ui: AdminUiExtension = {
//     id: 'tenant-ui',
//     extensionPath: path.join(__dirname, 'ui'),
//     routes: [
//       {
//         route: 'tenants',
//         filePath: 'routes.ts',
//       },
//     ],
//     providers: ['providers.ts'],
//     ngModules: [
//       {
//         type: 'shared',
//         ngModuleFileName: 'tenant-ui-shared.module.ts',
//         ngModuleName: 'TenantUiSharedModule',
//       },
//       {
//         type: 'lazy',
//         route: 'tenants',
//         ngModuleFileName: 'tenant-ui.module.ts',
//         ngModuleName: 'TenantUiModule',
//       },
//     ],
//   };
// }
