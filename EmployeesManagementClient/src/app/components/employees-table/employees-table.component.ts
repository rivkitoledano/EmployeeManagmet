import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employees.service';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import * as XLSX from 'xlsx';
import { MassageComponent } from '../massage/massage.component';
@Component({
  selector: 'app-employees-table',
   standalone: true, // Removed standalone
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    AddEmployeeComponent,
    MatToolbarModule
  ],
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss'] // Changed styleUrl to styleUrls
})
export class EmployeesTableComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'identity', 'entryDate', 'actions'];
  employees: MatTableDataSource<Employee>;
  filter!: string;
  employeesData: any[];

  constructor(private _employeeService: EmployeeService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute) {this.getEmployees() }

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees(): void {
    this._employeeService.getEmployeeList().subscribe({
      next: (result) => {
        this.employees = new MatTableDataSource<Employee>(result);
        this.employeesData=result
        console.log(this.employees);
      },
    });
  }

  deleteEmployee(employee: Employee): void {
    const dialogRef = this.dialog.open(MassageComponent, {
      width: '250px',
      data: { message: 'Are you shure you want to delete?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this._employeeService.deleteEmployee(employee.employeeId!).subscribe({
          next: () => {
            this.getEmployees();
          }
        });   
         }
    });
  
  }


  editEmployee(employee: Employee): void {
    this.router.navigate(['/editEmployee', employee.employeeId]);
  }


  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddEmployeeComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.getEmployees()
      }
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.employees.filter = filterValue;
  }
  downloadExcel(): void {
    // יצירת אובייקט שמייצג את הקובץ אקסל
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.employeesData);
    // יצירת אובייקט שמייצג את הקובץ אקסל עם הנתונים
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // המרת הקובץ אקסל למבנה ברור יותר של קובץ
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // הורדת הקובץ באמצעות יצירת עץ DOM והפניה אליו
    this.saveAsExcelFile(excelBuffer, 'employees_data');
  }


  // פונקציה זו מקבלת את הנתיב לקובץ ומקובץ את הנתונים לקובץ
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: 'application/octet-stream'});
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(data);
    a.download = `${fileName}.xlsx`;
    a.click();
    document.body.removeChild(a);
  }
}
