import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../../services/employees.service';
import {  Router } from '@angular/router';
import { PositionEmployee } from '../../models/positionEmployee.model';
import { PositionService } from '../../services/position.service';
import { MatTableDataSource } from '@angular/material/table';
import { Position } from '../../models/position.model';
import { Employee } from '../../models/employee.model';
import { MassageComponent } from '../massage/massage.component';

@Component({
  selector: 'app-edit-position-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-position-employee.component.html',
  styleUrl: './edit-position-employee.component.scss'
})
export class EditPositionEmployeeComponent implements OnInit{
  EditPositionEmployeeForm: FormGroup;
  positionlist:Position[]
  employeeId:number
  positionId:number
  employee:Employee
  positionEmployee:PositionEmployee

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditPositionEmployeeComponent>,
    private _employeeService:EmployeeService,
    private router:Router,
    private dialog: MatDialog, 
    private _positionService:PositionService,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number,positionId:number },
  ) {

    this.employeeId = data.employeeId;
    this.positionId = data.positionId;    
  }
  validateEntryDate(control: FormControl) {
    const entryDate = new Date(control.value);
    if (this.employee && new Date(entryDate) < new Date(this.employee.entryDate)) {
      return { invalidateEntryDate: true };
    }
    return null;
  }
  ngOnInit(): void {
  
    this._employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
      this.employee = employee;
    });
    this._employeeService.getPositionOfEmployeeById(this.employeeId,this.positionId).subscribe( pe=>{
        this.positionEmployee=pe;
        this.EditPositionEmployeeForm = this.formBuilder.group({
          isManagement:[this.positionEmployee.isManagement, Validators.required],
          entryDate: [this.positionEmployee.entryDate,[ this.validateEntryDate.bind(this)]],
        });
      }
    )
    this._positionService.getEmployeePositionsNotAssigned(this.employeeId).subscribe(positions => {
      this.positionlist = positions;
    });
  }


  save(): void {
    if (this.EditPositionEmployeeForm.valid) {
      const dialogRef = this.dialog.open(MassageComponent, {
        width: '350px',
        data: { message: 'Are you shure you want to save changes?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          const updatePositionEmployee: PositionEmployee = {
            positionId: this.positionId,
            isManagement:  this.EditPositionEmployeeForm.get('isManagement').value,
            entryDate: this.EditPositionEmployeeForm.get('entryDate').value,
          };
        
          this._employeeService.updatePositionOfEmployee(this.employeeId,this.positionId,updatePositionEmployee).subscribe({
            next: (res) => { 
              this.router.navigate(['/editEmployee',this.employeeId])
              this.dialogRef.close(this.EditPositionEmployeeForm.value);          },
        })
           }
      });
      
  }


  }

  close(): void {
    this.dialogRef.close();
  }
  
}
