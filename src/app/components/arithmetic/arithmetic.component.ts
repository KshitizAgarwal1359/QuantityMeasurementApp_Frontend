// UC20: Arithmetic Component
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UNITS_MAP } from '../../models/quantity.model';
import { QuantityService } from '../../services/quantity.service';

@Component({
  selector: 'app-arithmetic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './arithmetic.component.html',
  styleUrls: ['./arithmetic.component.scss'],
})
export class ArithmeticComponent implements OnChanges {
  @Input() measurementType = 'LENGTH';
  @Output() operationDone = new EventEmitter<void>();

  units: string[] = [];
  value1: number | null = null;
  value2: number | null = null;
  unit1 = '';
  unit2 = '';
  operator = '+';
  resultUnit = '';
  resultText = '---';
  isLoading = false;

  // Component variable — controls visibility of result unit dropdown
  showResultUnit = true;

  constructor(private quantityService: QuantityService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measurementType']) {
      this.units = UNITS_MAP[this.measurementType] || [];
      this.unit1 = this.units[0] || '';
      this.unit2 = this.units[0] || '';
      this.resultUnit = this.units[0] || '';
    }
  }

  onOperatorChange(): void {
    this.showResultUnit = this.operator !== '/';
  }

  onCalculate(): void {
    if (this.value1 == null || this.value2 == null) return;
    this.isLoading = true;
    this.quantityService.arithmetic(
      this.value1, this.unit1, this.value2, this.unit2,
      this.measurementType, this.resultUnit, this.operator
    ).subscribe({
      next: (resp) => {
        this.resultText = String(resp.resultValue);
        this.isLoading = false;
        this.operationDone.emit();
      },
      error: () => { this.isLoading = false; },
    });
  }

  onClear(): void {
    this.value1 = null;
    this.value2 = null;
    this.resultText = '---';
  }
}
