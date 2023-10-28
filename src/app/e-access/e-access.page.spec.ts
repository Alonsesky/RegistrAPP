import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EAccessPage } from './e-access.page';

describe('EAccessPage', () => {
  let component: EAccessPage;
  let fixture: ComponentFixture<EAccessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EAccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
