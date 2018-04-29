import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { MovieService } from '../../services/movie/movie.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
// import { SafeResourceUrl, DomSanitizationService } from '@angular/platform-browser';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit
{
  comments = [];
  newcomment = '';
  url : SafeResourceUrl;
  movie = null;
  video_id = null;
  current_user = null;

  constructor(private _userService: UserService, private _movieService: MovieService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit()
  {
    let id = this.route.snapshot.paramMap.get('id');

    this.current_user = this._userService.getCurrentUser();

    if (id == undefined)
      this.router.navigateByUrl('/home');

    this.video_id = id;

          // Get the video info

    this._movieService.find({query_type: 'single_video', id})
    .subscribe(res =>
    {
      res = res.json();

      if (!res || !res['data'])
        return;

      this.movie = res['data'];
      let t = this.movie.release_date,
        title;

      if (!t || !this.movie)
        return;

      t = new Date(t).getFullYear();


      title = this.movie.title + ' ' + t;
      this.url = 'http://localhost:3000/movie/stream/' + title;


          // Get the video strea

      // console.log('sdsdsdds')
      this._movieService.stream(title);

      this._movieService.subtitles({imdb_id: this.movie.imdb_id, title})

      this._userService.update({viewd_movies: id});

      this._movieService.getComment({movie_id: id})
      .subscribe(res => this.comments = res['data'])

    })
  }

  postComment()
  {
    let newcomment = this.newcomment;

    if (!newcomment || newcomment.length > 255)
      return;

    this._movieService.postComment({ movie_id: this.movie.id, post: newcomment })
    .subscribe(res=>
    {
      this.comments.push({user: {login: this.current_user.login, picture: this.current_user.picture}, post: newcomment})
     this.newcomment = '';
    })
  }

  logout() {
    this._userService.logout();
  }

}
