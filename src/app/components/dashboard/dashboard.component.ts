// UC20: Dashboard Component — Component Composition, Lifecycle Hooks, Services, Change Detection
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuantityService } from '../../services/quantity.service';
import { QuantityMeasurementDTO } from '../../models/quantity.model';

// Component Composition — importing child components
import { HeaderComponent } from '../header/header.component';
import { TypeSelectorComponent } from '../type-selector/type-selector.component';
import { ActionTabsComponent } from '../action-tabs/action-tabs.component';
import { ConversionComponent } from '../conversion/conversion.component';
import { ComparisonComponent } from '../comparison/comparison.component';
import { ArithmeticComponent } from '../arithmetic/arithmetic.component';
import { HistoryComponent } from '../history/history.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    TypeSelectorComponent,
    ActionTabsComponent,
    ConversionComponent,
    ComparisonComponent,
    ArithmeticComponent,
    HistoryComponent,
    ToastComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Component variables
  selectedType = 'LENGTH';
  selectedAction = 'comparison';
  historyItems: QuantityMeasurementDTO[] = [];

  // ViewChild — access child component instance
  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(
    private authService: AuthService,
    private quantityService: QuantityService,
    private router: Router
  ) {}

  // Lifecycle Hook — ngOnInit
  ngOnInit(): void {
    this.loadHistory();
  }

  // Event Handling — receives @Output events from child components
  onTypeChanged(type: string): void {
    this.selectedType = type;
  }

  onActionChanged(action: string): void {
    this.selectedAction = action;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Called when any operation completes — @Output event from child
  onOperationDone(): void {
    this.loadHistory();
  }

  // Service call — fetch user history
  private loadHistory(): void {
    this.quantityService.getMyHistory().subscribe({
      next: (items) => (this.historyItems = items),
      error: () => (this.historyItems = []),
    });
  }
}
