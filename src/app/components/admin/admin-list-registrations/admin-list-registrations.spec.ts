import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListRegistrations } from './admin-list-registrations';

describe('AdminListRegistrations', () => {
  let component: AdminListRegistrations;
  let fixture: ComponentFixture<AdminListRegistrations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminListRegistrations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminListRegistrations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
