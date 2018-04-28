import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie/movie.service';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories = [];
  search = { startYY : '1970', endYY: '', minNote: '', maxNote: '', with_genres: '' };
  movieList = [];
  viewd_movies = [];
  genres = [];


  constructor(private _movieService: MovieService, private _userService: UserService) {

  }

  ngOnInit()
  {
    let params =
    {
      query_type : 'discover',
      sort_by : 'popularity.desc',
      'primary_release_date.gte' : '1996',
      page : 1
      
    }

    let current_user = this._userService.getCurrentUser();
    this.viewd_movies = current_user.viewd_movies;

    this._movieService.find(params)
    .subscribe(res => 
    {
      let movies = res.json();

      if (movies)
        movies = movies.data;

      if (movies.total_results)
        this.movieList = movies.results;

      this._movieService.find({query_type : 'genre'})
      .subscribe(res => 
      {
        let genres = res.json();

        if (genres && genres.data && genres.data.genres)
          this.genres = genres.data.genres;
      });

    });
  }

  advancedSearch()
  {
    let params = {};

    if (this.search.with_genres)
      params['with_genres'] = this.search.with_genres;
    if (this.search.startYY)
      params['primary_release_date.gte'] = this.search.startYY;

      // search = { startYY, endYY, minNote, maxNote, with_genres} = this.search;

    params['query_type'] = 'discover';

    if (this.search.startYY)
      params['primary_release_date.gte'] = this.search.startYY;

    if (this.search.endYY)
      params['primary_release_date.lte'] = this.search.endYY;

    if (this.search.minNote)
      params['vote_average.gte'] = this.search.minNote;

    if (this.search.maxNote)
      params['vote_average.lte'] = this.search.maxNote;



    this._movieService.find(params)
    .subscribe(res => 
    {
      let movies = res.json();

      if (movies)
        movies = movies.data;

      if (movies.total_results)
        this.movieList = movies.results;
      console.log(movies)
    })
  }

  onlyNumbers(e: KeyboardEvent) {
    const regexStr = '^[0-9]*$';
        if ([46, 8, 9, 27, 13, 110, 190, 171].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39) ||
            // Allow plus button
            (e.keyCode === 107) || (e.keyCode === 187)) {
            // let it happen, don't do anything
            return;
        }
        const /** @type {?} */ ch = String.fromCharCode(e.keyCode);
        const /** @type {?} */ regEx = new RegExp(regexStr);
        if (regEx.test(ch)) {
            return;
        } else if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
}

}
