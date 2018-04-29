import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';
import { MovieService } from './services/movie/movie.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from "rxjs/Rx"
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent
{
  title = 'app';
  is_login = this._userService.loggedIn();
  searchValue = '';
  is_searching = false;
  movieList = [];
  viewd_movies = [];
  usePic = '' as SafeUrl;
  current_user = null;

  constructor(private _userService: UserService, private _movieService: MovieService, private router: Router, private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {}

  ngOnInit()
  {
    if (this.is_login) {
      this.current_user = this._userService.getCurrentUser();
      console.log(this.current_user);
      if (this.current_user && this.current_user.viewd_movies)
        this.viewd_movies = this.current_user.viewd_movies;
      if (this.current_user && this.current_user.picture)
        this.usePic =  this.sanitizer.bypassSecurityTrustUrl(this.current_user.picture);
    }
  }

  ngAfterViewInit() {
    this._userService.signedIn.subscribe(val => {
      this.is_login = val;

      if (this.is_login) {
        let current_user = this._userService.getCurrentUser();
        if (current_user && current_user.picture) 
          this.usePic =  this.sanitizer.bypassSecurityTrustUrl(current_user.picture);
      } else if (!this.is_login){
        this.usePic = '';
      }

    })
  }

  logout(){
    this._userService.logout();
  }

  sanitizePic(usePic): SafeUrl {
      return `url(${usePic})`
  }

  search(name)
  {
    if (!name)
    {
      this.is_searching = false;
      return;
    }
    this.is_searching = true;


    this._movieService.find({query_type: 'search', query: name})
    .subscribe(res => 
    {
      // res = res.json();
      let movies = res.json();

      if (!movies || !(movies = movies.data))
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
