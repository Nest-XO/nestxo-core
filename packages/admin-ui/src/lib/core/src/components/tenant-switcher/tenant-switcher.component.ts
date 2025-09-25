import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'vdr-tenant-switcher',
    templateUrl: './tenant-switcher.component.html',
    styleUrls: ['./tenant-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class TenantSwitcherComponent implements OnInit {
    readonly displayFilterThreshold = 10;
    tenants$: Observable<any[]>;
    tenantCount$: Observable<number>;
    filterControl = new UntypedFormControl('');
    activeTenantCode$: Observable<string>;

    ngOnInit() {
        this.tenants$ = of([
            { code: 'fashionfolks', id: 1 },
            { code: 'euroshop', id: 2 },
        ]);
        this.tenantCount$ = of(2);
        this.activeTenantCode$ = of('fashionfolks');
    }

    setActiveTenant(tenantId: string) {
        // No-op
    }
}
