import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  authToken: any;

  constructor(private http: Http, private router: Router) { }

  signup(user) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/auth/signup', user, { headers: headers })
      .subscribe(res =>
        {
          let r = res.json();

          if (r.token)
          {
              localStorage.setItem('token', r.token);
              this.router.navigate(['/home']);
          }
        return r
      })
  }

  signin(user, strategy)
  {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (strategy != 'local')
      window.location.href = `http://localhost:3000/auth/${strategy}`;
    console.log(user)
    return this.http.post('http://localhost:3000/auth/signin', user, { headers: headers })
      .subscribe(res => res.json())
  }

  strategySignin(token)
  {
    localStorage.setItem('token', token);
    this.router.navigate(['/home']);
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
    this.router.navigate(['/'])
  }

}
