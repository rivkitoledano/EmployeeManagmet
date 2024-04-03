import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPositionEmployeeComponent } from './add-position-employee.component';

describe('AddPositionEmployeeComponent', () => {
  let component: AddPositionEmployeeComponent;
  let fixture: ComponentFixture<AddPositionEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPositionEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddPositionEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
