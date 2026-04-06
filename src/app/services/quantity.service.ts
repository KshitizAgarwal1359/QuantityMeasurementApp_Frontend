// UC20: Quantity Measurement Service — HttpClient calls for convert, compare, arithmetic, history
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuantityMeasurementDTO } from '../models/quantity.model';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private readonly apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // UC20: Convert quantity using HttpClient
  convert(value: number, fromUnit: string, toUnit: string, type: string): Observable<QuantityMeasurementDTO> {
    return this.http.post<QuantityMeasurementDTO>(`${this.apiUrl}/quantities/convert`, {
      thisQuantityDTO: { value, unitName: fromUnit, measurementType: type },
      targetUnit: toUnit,
    });
  }

  // UC20: Compare two quantities
  compare(v1: number, u1: string, v2: number, u2: string, type: string): Observable<QuantityMeasurementDTO> {
    return this.http.post<QuantityMeasurementDTO>(`${this.apiUrl}/quantities/compare`, {
      thisQuantityDTO: { value: v1, unitName: u1, measurementType: type },
      thatQuantityDTO: { value: v2, unitName: u2, measurementType: type },
    });
  }

  // UC20: Arithmetic operations (add, subtract, divide)
  arithmetic(v1: number, u1: string, v2: number, u2: string, type: string, resultUnit: string, operator: string): Observable<QuantityMeasurementDTO> {
    let endpoint = '/quantities/add';
    if (operator === '-') endpoint = '/quantities/subtract';
    else if (operator === '/') endpoint = '/quantities/divide';

    return this.http.post<QuantityMeasurementDTO>(`${this.apiUrl}${endpoint}`, {
      thisQuantityDTO: { value: v1, unitName: u1, measurementType: type },
      thatQuantityDTO: { value: v2, unitName: u2, measurementType: type },
      targetUnit: resultUnit,
    });
  }

  // UC20: Get user's history
  getMyHistory(): Observable<QuantityMeasurementDTO[]> {
    return this.http.get<QuantityMeasurementDTO[]>(`${this.apiUrl}/quantities/history/my`);
  }
}
