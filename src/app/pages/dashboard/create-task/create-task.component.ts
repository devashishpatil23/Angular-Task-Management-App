import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../core/services/toaster.service';
import { Task } from '../../../model/Task';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-task',
  imports: [LoaderComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements OnInit, AfterViewInit {
  taskService: TaskService = inject(TaskService);
  authService: AuthService = inject(AuthService);
  toasterService = inject(ToasterService);
  fb: FormBuilder = inject(FormBuilder);
  taskForm!: FormGroup;
  isLoading = signal<boolean>(false);
  private destroyRef: DestroyRef = inject(DestroyRef);
  createdBy: string | undefined = '';

  @Output() closeForm: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  updatedTask: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  editTask!: Task | null | undefined;

  ngOnInit(): void {
    this.initializeForm();
    this.getUser();
  }
  ngAfterViewInit() {
    if (this.editTask) {
      this.taskForm.patchValue(this.editTask);
      console.log(this.editTask);
    } else {
      this.initializeForm();
      console.log(this.editTask);
    }
  }

  onFormSubmit() {
    const data = this.editTask
      ? { ...this.taskForm.value, createdBy: this.editTask.createdBy }
      : { ...this.taskForm.value, createdBy: this.createdBy };
    this.isLoading.set(true);

    const saveForm = this.editTask
      ? this.taskService.updateTask(data, this.editTask?.id)
      : this.taskService.createTask(data);

    saveForm.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.handelresponse();
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false);
      },
      complete: () => {},
    });
  }

  private handelresponse() {
    const message = this.editTask ? 'Upadted' : 'Created';
    this.toasterService.showSuccess(`Task ${message} Successfully!`);
    this.updatedTask.emit();
    this.oncloseForm();
    this.isLoading.set(false);
  }

  oncloseForm() {
    this.taskForm.reset();
    this.closeForm.emit();
    this.editTask = null;
  }

  initializeForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: ['', Validators.required],
      createdAt: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  getUser() {
    this.authService.user.subscribe((user) => {
      this.createdBy = user?.email;
    });
  }
}
