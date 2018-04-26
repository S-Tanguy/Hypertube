import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';


@Injectable()
export class MovieService
{

  constructor(private http: Http, private router: Router)
  {}

  find(params)
  {
  	const token = localStorage.getItem('token');

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    return this.http.get(`http://localhost:3000/movie/find`, { headers: headers, params })
  }

  findById(id)
  {
  	const token = localStorage.getItem('token');

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    return this.http.get(`http://localhost:3000/movie/${id}`, { headers: headers})
  }

  stream(name)
  {
  	const token = localStorage.getItem('token');

    const headers = new Headers();
    headers.append('Authorization', "Bearer " + token);

    return this.http.get(`http://localhost:3000/movie/stream/${name}`, { headers: headers})
  }

}
