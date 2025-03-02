import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // const modifiedReq = req.clone({ headers: req.headers.set('auth', 'abcxyz') });

  return authService.user.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user || !user.token) return next(req);
      const modifiedReq = req.clone({
        params: new HttpParams().set('auth', user?.token),
      });
      return next(modifiedReq);
    })
  );
};