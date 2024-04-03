import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionEmployeeTableComponent } from './position-employee-table.component';

describe('PositionEmployeeTableComponent', () => {
  let component: PositionEmployeeTableComponent;
  let fixture: ComponentFixture<PositionEmployeeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionEmployeeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PositionEmployeeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
