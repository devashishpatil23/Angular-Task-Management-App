import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../../model/AuthResponse';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { User } from '../../model/User';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import * as CryptoJS from 'crypto-js';
import { Constant } from '../../constant';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  user = new BehaviorSubject<User | null>(null);
  private router: Router = inject(Router);
  private logoutTimer: any | null = null;

  signUp(userCred: any): Observable<AuthResponse> {
    const data = { ...userCred, returnSecureToken: true };
    console.log(data);
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKEY}`,
        data
      )
      .pipe(
        tap((res) => {
          this.handelCreateUser(res);
        })
      );
  }
  login(userCred: any): Observable<AuthResponse> {
    const data = { ...userCred, returnSecureToken: true };
    console.log(data);
    return this.http
      .post<AuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKEY}`,
        data
      )
      .pipe(
        tap((res) => {
          this.handelCreateUser(res);
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  autoLogout(expireTime: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout();
    }, expireTime);
  }

  autoLogin() {
    const encryptedUserData = localStorage.getItem('user');

    if (!encryptedUserData) return;

    const decrytedData = this.decryptData(encryptedUserData);
    if (!decrytedData) return;

    const user = JSON.parse(decrytedData);
    const loggedUser = new User(
      user.email,
      user.id,
      user._token,
      user._expiresIn
    );
    if (loggedUser.token) {
      this.user.next(loggedUser);
      const timmerValue =
        new Date(user._expiresIn).getTime() - new Date().getTime();
      this.autoLogout(timmerValue);
    }
    this.user.next(loggedUser);
  }

  private handelCreateUser(res: AuthResponse) {
    // Calculate the expiration timestamp (current time + token expiration time in milliseconds)
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    // Convert the timestamp into a Date object
    const expires = new Date(expiresInTs);
    const user = new User(res.email, res.localId, res.idToken, expires);
    const encryptUser = this.encryptData(JSON.stringify(user));
    this.autoLogout(Number(res.expiresIn) * 1000);
    this.user.next(user);

    localStorage.setItem('user', encryptUser);
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, Constant.EN_KEY).toString();
  }
  private decryptData(encryptedData: string): string | null {
    const decryptValue = CryptoJS.AES.decrypt(encryptedData, Constant.EN_KEY);
    return decryptValue.toString(CryptoJS.enc.Utf8);
  }
}
