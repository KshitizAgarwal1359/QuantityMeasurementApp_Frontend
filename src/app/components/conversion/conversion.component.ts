// UC20: Conversion Component — @Input, @Output, Reactive Forms, Services
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UNITS_MAP } from '../../models/quantity.model';
import { QuantityService } from '../../services/quantity.service';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss'],
})
export class ConversionComponent implements OnChanges {
  @Input() measurementType = 'LENGTH';
  @Output() operationDone = new EventEmitter<void>();

  units: string[] = [];
  fromValue: number | null = null;
  toValue: number | null = null;
  fromUnit = '';
  toUnit = '';
  isLoading = false;

  constructor(private quantityService: QuantityService) {}

  // Change Detection — react to @Input changes
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measurementType']) {
      this.units = UNITS_MAP[this.measurementType] || [];
      this.fromUnit = this.units[0] || '';
      this.toUnit = this.units[1] || this.units[0] || '';
    }
  }

  onConvert(): void {
    if (this.fromValue == null || isNaN(this.fromValue)) return;
    this.isLoading = true;
    this.quantityService.convert(this.fromValue, this.fromUnit, this.toUnit, this.measurementType)
      .subscribe({
        next: (resp) => {
          this.toValue = resp.resultValue;
          this.isLoading = false;
          this.operationDone.emit();
        },
        error: () => { this.isLoading = false; },
      });
  }

  onClear(): void {
    this.fromValue = null;
    this.toValue = null;
  }
}
