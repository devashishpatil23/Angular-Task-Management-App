import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../core/services/toaster.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [LoaderComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  toaster = inject(ToasterService);
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  isLoginMode = signal<boolean>(true);
  isLoading = signal<boolean>(false);
  authForm!: FormGroup;
  private destroyRef: DestroyRef = inject(DestroyRef);

  ngOnInit() {
    this.intializeAuthForm();
  }
  onSwitchMode() {
    this.isLoginMode.set(!this.isLoginMode());
  }

  onFormSubmit() {
    this.isLoading.set(true);

    const submitAction = this.isLoginMode()
      ? this.authService.login(this.authForm.value)
      : this.authService.signUp(this.authForm.value);
    if (this.authForm.valid) {
      submitAction.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.isLoginMode()
            ? this.toaster.showSuccess('Logged in successfully')
            : this.toaster.showSuccess('Signed up successfully');
          this.router.navigate(['/dashboard/tasks']);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
        },
      });
    }

    this.authForm.reset();
  }

  intializeAuthForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
