import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { PositionEmployee } from '../models/positionEmployee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl: string = 'https://localhost:7122/api/Employees';

  constructor(private http: HttpClient) {}
  
  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}`); 
  }

  getEmployeeById(id:number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`); 
  }

  addNewEmployee(employee: Employee): Observable<Employee> { 
    return this.http.post<Employee>(`${this.baseUrl}`, employee); 
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee); 
  }

  deleteEmployee(id: number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.baseUrl}/${id}`); 
  }
  
  getPositionsOfEmployeeList(id:number): Observable<PositionEmployee[]> {
    return this.http.get<PositionEmployee[]>(`${this.baseUrl}/${id}/positions`); 
  }
  getPositionOfEmployeeById(employeeId:number,positionId:number): Observable<PositionEmployee> {
    return this.http.get<PositionEmployee>(`${this.baseUrl}/${employeeId}/position/${positionId}`); 
  }
  addNewPositionToEmployee(employeeId:number,positionEmp: PositionEmployee): Observable<PositionEmployee> { 
    return this.http.post<PositionEmployee>(`${this.baseUrl}/${employeeId}/position`, positionEmp);
  }

  updatePositionOfEmployee(employeeId: number,positionId:number, positionEmp: PositionEmployee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${employeeId}/position/${positionId}`, positionEmp); }

  deletePositionOfEmployee(employeeId: number,positionId:number): Observable<Employee> {
    return this.http.delete<Employee>(`${this.baseUrl}/${employeeId}/position/${positionId}`); 
  }
}
