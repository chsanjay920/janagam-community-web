import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStates } from './admin-states';

describe('AdminStates', () => {
  let component: AdminStates;
  let fixture: ComponentFixture<AdminStates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminStates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
