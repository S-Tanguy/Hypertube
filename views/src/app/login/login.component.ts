import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'login-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent
{
  title = 'login';

  constructor(private http: Http)
  {
  	this.http.get(`http://localhost:3000/users/`)
  	.subscribe(users =>
  	{
  		console.log(users)
  	})
  }
}
