import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {  Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employees.service';
import { Router } from '@angular/router';
import { min } from 'rxjs';
import { MassageComponent } from '../massage/massage.component';
import { AddPositionEmployeeComponent } from '../add-position-employee/add-position-employee.component';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,MatDatepickerModule,MatNativeDateModule
  ],


  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})


export class AddEmployeeComponent {
  employeeForm: FormGroup;
  newEmployee: Employee;
// פונקציה זו מבצעת את התקינות שהתאריך לידה אינו ב-15 השנים האחרונות
validateBirthDate(control: FormControl) {
  const birthDate = new Date(control.value);
  const currentDate = new Date();
  const maxAllowedDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
  if (birthDate > maxAllowedDate) {
    return { invalidBirthDate: true };
  }
  return null;
}

// פונקציה זו מבצעת את התקינות שהתאריך כניסת העובד אינו לפני התאריך הנוכחי
validateEntryDate(control: FormControl) {
  const entryDate = new Date(control.value);
  const currentDate = new Date();
  if (entryDate < currentDate) {
    return { invalidEntryDate: true };
  }
  return null;
}
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEmployeeComponent>,
    private _employeeService:EmployeeService,
    private router:Router,
    private dialog: MatDialog, 

  ) {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
  lastName: ['', [Validators.required, Validators.minLength(2)]],
  identity: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
  birthDate: ['', [Validators.required, this.validateBirthDate.bind(this)]], // שימוש ב-bind כדי לשמור על ההקשר של 'this'
  gender: ['', Validators.required],
  entryDate: ['', [Validators.required, this.validateEntryDate.bind(this)]], // שימוש ב-bind כדי לשמור על ההקשר של 'this'

    });
    // הוספת תפקיד ראשון בסיסי
  }
  
initNewEmployee(){
   this.newEmployee = {
    firstName: this.employeeForm.get('firstName').value,
    lastName:  this.employeeForm.get('lastName').value,
    identity:  this.employeeForm.get('identity').value,
    birthDate: this.employeeForm.get('birthDate').value,
    entryDate: this.employeeForm.get('entryDate').value,
    gender:    this.employeeForm.get('gender').value
  };
}
  editPositions(){
    if (this.employeeForm.valid) {
      this.initNewEmployee();
      this._employeeService.addNewEmployee(this.newEmployee).subscribe({
        next: (res) => { 
          console.log(res,"rss")
          if(res)
           {
            const dialogRef = this.dialog.open(AddPositionEmployeeComponent, {
              width: '35%',
              height:'70%',
              data: { employeeId: res.employeeId } // Pass employeeId to the dialog component
            });
        
            dialogRef.afterClosed().subscribe(formData => {
              this._employeeService.getPositionsOfEmployeeList(res.employeeId).subscribe({
                next: (result) => {
                  this.router.navigate(['editEmployee',res.employeeId])
                },
              });
            
      
            });
           }   },
    })
    this.dialogRef.close(this.employeeForm.value);

  }   
  }
  
  save(): void {
   
  
    if (this.employeeForm.valid) {
      const dialogRef = this.dialog.open(MassageComponent, {
        width: '300px',
        data: { message: 'Are you shure you want to save?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this.initNewEmployee();
          this._employeeService.addNewEmployee(this.newEmployee).subscribe({
            next: () => { 
            this.router.navigate(['/employeesTable'])
            this._employeeService.getEmployeeList().subscribe(); 
            this.dialogRef.close(this.employeeForm.value);
          },
        })  
           }
      });
    
  }
 
  }

  close(): void {
    this.dialogRef.close();
  }
  
}
