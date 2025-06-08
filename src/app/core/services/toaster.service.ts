import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  toaster = inject(ToastrService);

  showSuccess(message: string) {
    this.toaster.success(message);
  }
  showError(error: HttpErrorResponse) {
    if (error?.error?.error === 'Permission denied') {
      this.toaster.error('You do not have permission!');
      return;
    }

    switch (error?.error?.error?.message) {
      case 'EMAIL_EXISTS':
        this.toaster.error('Email already exists');
        break;

      case 'INVALID_LOGIN_CREDENTIALS':
        this.toaster.error('Invalid credentials or user does not exist!');
        break;
      default:
        this.toaster.error('Something went wrong! An unknown error occurred.');
        break;
    }
  }
}
