import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { User } from '../../../model/User';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private authService: AuthService = inject(AuthService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  isLogedIn = signal<User | null>(null);

  ngOnInit() {
    this.authService.user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: User | null) => {
        this.isLogedIn.set(user ? user : null);
      });
  }

  onLogout() {
    this.authService.logout();
  }
}
