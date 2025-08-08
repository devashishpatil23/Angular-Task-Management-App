import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { ToasterService } from '../../../core/services/toaster.service';

import { Task } from '../../../model/Task';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../shared/components/filter/filter.component';
import { TaskFilters } from '../../../model/TaskFilters';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskCardComponent } from '../../../shared/components/task-card/task-card.component';

@Component({
  selector: 'app-tasks',
  imports: [
    CreateTaskComponent,
    TaskDetailsComponent,
    LoaderComponent,
    CommonModule,
    FilterComponent,
    TaskCardComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  taskService: TaskService = inject(TaskService);
  toasterService = inject(ToasterService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  allTasks = signal<Task[]>([]);
  filteredTasks = signal<Task[]>([]);
  editTask = signal<Task | null>(null);
  errorMessage = signal<string | null>(null);
  showDetailsView = signal<boolean>(false);
  showTask = signal<Task | null>(null);
  ngOnInit(): void {
    this.getAllTasks();
  }

  getAllTasks() {
    this.isLoading.set(true);
    this.taskService
      .getAllTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.allTasks.set(tasks);
          this.filteredTasks.set(tasks);
          this.isLoading.set(false);
          console.log(this.allTasks());
        },
        error: (error) => {
          this.errorMessage.set(error.message);
          this.isLoading.set(false);
        },
      });
  }

  onFilterApplied(filters: TaskFilters) {
    if (!filters.priority && !filters.status) {
      this.filteredTasks.set(this.allTasks());
      return;
    }

    const filteredTasks = this.allTasks().filter((task) => {
      return (
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.status || task.status === filters.status)
      );
    });

    this.filteredTasks.set(filteredTasks);
  }

  showTaskDetails(task: Task) {
    this.showDetailsView.set(true);
    this.showTask.set(task);
  }
  closeDetialsView() {
    this.showDetailsView.set(false);
  }

  onEditTask(task: Task) {
    this.showForm.set(true);
    this.editTask.set(task);
  }

  onDeleteTask(id: string | undefined) {
    if (!id) return;
    const confirmDelete = confirm('Are you sure you want to delete the task?');
    if (confirmDelete) {
      this.isLoading.set(true);
      this.taskService
        .deleteTask(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            const updatedTasks = this.filteredTasks().filter((task) => {
              return task.id !== id;
            });
            this.filteredTasks.set(updatedTasks);
            this.toasterService.showSuccess('Task Deleted Successfully');
            this.isLoading.set(false);
          },
          error: (error) => {
            console.log(error);
            this.isLoading.set(false);
          },
        });
    }
  }

  clearAllTasks() {
    const confirmDelete = confirm('Are you sure you want to delete all task?');
    if (confirmDelete) {
      this.isLoading.set(true);
      this.taskService
        .deleteAllTasks()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.toasterService.showSuccess('All Task Deleted');
            this.filteredTasks.set([]);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.log(error);
            this.isLoading.set(false);
          },
        });
    }
  }

  fetchUpdatedTasks() {
    this.getAllTasks();
  }

  onCloseForm() {
    this.showForm.set(false);
    this.editTask.set(null);
  }
  onCreateTask() {
    this.showForm.set(true);
  }
}
