import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {
  authToken: any;

  constructor(private http: Http) { }

  signUpUser(user) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/signup', user, { headers: headers })
      .map(res => res.json())
  }

  authenticateUser(user) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/login', user, { headers: headers })
      .map(res => res.json())
  }

  storeUserData(token, email) {
    localStorage.setItem('token', token)
    // localStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('connected', 'true');
    sessionStorage.setItem('currentUser', email);
  }

  getCurrentUser() {
    return (sessionStorage.getItem('currentUser'));
  }

  loadToken() {
    const token = localStorage.getItem('token')
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('token')
  }

  logout() {
    sessionStorage.clear();
    localStorage.clear();
  }

}
