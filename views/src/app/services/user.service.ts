import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {
  authToken: any;

  constructor(private http: Http) { }

  signup(user) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return this.http.post('http://localhost:3000/auth/signup', user, { headers: headers })
      .map(res => res.json())
  }

  signin(user, strategy)
  {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json');

    let url;

    if (strategy == 'local')
      return this.http.post('http://localhost:3000/auth/signin', user, { headers: headers })
        .map(res => res.json())

        // console.log('sdsd00')
    window.location.href = `http://localhost:3000/auth/${strategy}`;
        
    // return this.http.get(`http://localhost:3000/auth/${strategy}`)
    // .map(res =>
    //   {
    //     res.json()
    //     console.log('ds')
      // })
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
