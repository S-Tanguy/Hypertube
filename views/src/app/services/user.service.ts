import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import * as decode from 'jwt-decode';


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
            this.setCurrentUser(r.token);
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
      return window.location.href = `http://localhost:3000/auth/${strategy}`;

    // console.log(user)
    return this.http.post('http://localhost:3000/auth/signin', user, { headers: headers })
      .subscribe(res =>
      {
        let r = res.json();

        if (r.token)
            localStorage.setItem('token', r.token);
          this.setCurrentUser(r.token);
    
        this.router.navigate(['/home']);
        return r
      })
  }

  update(data)
  {
    const token = localStorage.getItem('token');

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    return this.http.put('http://localhost:3000/user', data, { headers: headers })
      .subscribe(res =>
      {
        let r = res.json();

        if (r.token)
        {
          localStorage.setItem('token', r.token);
          this.setCurrentUser(r.token);
        }
        return r
      })
  }

  reset_pass(email)
  {
    const token = localStorage.getItem('token');

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    return this.http.post('http://localhost:3000/user/reset_pass', {email})
      .subscribe(res =>
      {
        let r = res.json();
        return r
      })

  }

  strategySignin(token)
  {
    localStorage.setItem('token', token);
    this.setCurrentUser(token);
    this.router.navigate(['/home']);
  }


  storeUserData(token, email) {
    localStorage.setItem('token', token)
    // localStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('connected', 'true');
    sessionStorage.setItem('currentUser', email);
  }

  getCurrentUser() {
    let r = sessionStorage.getItem('currentUser');

    return (JSON.parse(r));
  }

  setCurrentUser(tokenUser) {
    tokenUser = decode(tokenUser);

    tokenUser = JSON.stringify(tokenUser);
    // console.log(tokenUser)
    window.sessionStorage.setItem('currentUser', tokenUser);
  }

  loadToken() {
    const token = localStorage.getItem('token')
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('token')
  }

  logout() {
    // console.log('ok')
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/'])
  }

}
