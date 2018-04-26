import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _movieService: MovieService)
  {

  }

  ngOnInit() {
  	// this._movieService.find('roi lion', 'fr')
  	// .subscribe(res =>
  	// {
  	// 	res = res.json()
  	// 	console.log(res)

  	// })
  }

}
