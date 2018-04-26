import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { MovieService } from './services/movie/movie.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{
  title = 'app';
  is_login = false;
  searchValue = '';
  is_searching = false;
  movieList = [];

  constructor(private _userService: UserService, private _movieService: MovieService)
  {}

  ngOnInit()
  {
    let current_user = this._userService.getCurrentUser();

    this.is_login = this._userService.loggedIn();
  }

  logout()
  {
    this._userService.logout();
  }

  search(name)
  {
    if (!name)
    {
      this.is_searching = false;
      return;
    }
    this.is_searching = true;

    this._movieService.find({name})
    .subscribe(res => 
    {
      // res = res.json();
      let movies = res.json();
      if (!movies || !(movies = movies.movies))
        return;

      if (!movies.total_results)
        return;
      this.movieList = movies.results;

    });
  }

  emptyInput(movie)
  {
    this.searchValue = null;
    this.is_searching = false;
    this.movieList = [];
  }

}
