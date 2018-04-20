import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{
  title = 'app';

  constructor(private http: Http)
  {
  	this.http.get(`http://localhost:3000/users/`)
  	.subscribe(users =>
  	{
  		console.log(users)
  	})
  }
}
