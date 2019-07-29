import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMenuComponent } from './all-menu.component';

describe('AllMenuComponent', () => {
  let component: AllMenuComponent;
  let fixture: ComponentFixture<AllMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
