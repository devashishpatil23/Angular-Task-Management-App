import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskFilters } from '../../../model/TaskFilters';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<{
    priority?: string;
    status?: string;
  }>();

  filterForm!: FormGroup;
  fb: FormBuilder = inject(FormBuilder);

  @Output()
  filterApplied = new EventEmitter<TaskFilters>();

  ngOnInit() {
    this.initializeForm();
  }

  onApplyFilter() {
    this.filterApplied.emit(this.filterForm.value);
  }
  onReset() {
    this.initializeForm();
    this.filterApplied.emit(this.filterForm.value);
  }

  initializeForm() {
    this.filterForm = this.fb.group({
      priority: [''],
      status: [''],
    });
  }
}
