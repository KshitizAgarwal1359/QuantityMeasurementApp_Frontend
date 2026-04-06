// UC20: Comparison Component
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UNITS_MAP } from '../../models/quantity.model';
import { QuantityService } from '../../services/quantity.service';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent implements OnChanges {
  @Input() measurementType = 'LENGTH';
  @Output() operationDone = new EventEmitter<void>();

  units: string[] = [];
  value1: number | null = null;
  value2: number | null = null;
  unit1 = '';
  unit2 = '';
  resultIcon = '?';
  resultText = '---';
  resultColor = '#5873ff';
  isLoading = false;

  constructor(private quantityService: QuantityService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measurementType']) {
      this.units = UNITS_MAP[this.measurementType] || [];
      this.unit1 = this.units[0] || '';
      this.unit2 = this.units[0] || '';
    }
  }

  onCompare(): void {
    if (this.value1 == null || this.value2 == null) return;
    this.isLoading = true;
    this.quantityService.compare(this.value1, this.unit1, this.value2, this.unit2, this.measurementType)
      .subscribe({
        next: (resp) => {
          const isEqual = resp.resultString?.toLowerCase() === 'true';
          this.resultIcon = isEqual ? '=' : '≠';
          this.resultText = isEqual ? 'Equal' : 'Not Equal';
          this.resultColor = isEqual ? '#6cc19d' : '#e74c3c';
          this.isLoading = false;
          this.operationDone.emit();
        },
        error: () => { this.isLoading = false; },
      });
  }

  onClear(): void {
    this.value1 = null;
    this.value2 = null;
    this.resultIcon = '?';
    this.resultText = '---';
    this.resultColor = '#5873ff';
  }
}
