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
export class VideoComponent implements OnInit {
  comments = [];
  newcomment = '';
<<<<<<< HEAD
  url : SafeResourceUrl;
=======
  url : SafeResourceUrl; 
>>>>>>> e8f6a947b4092909031248da439bd5567a4b924e
  movie = null;

  constructor(private _userService: UserService, private _movieService: MovieService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit()
  {
    let id = this.route.snapshot.paramMap.get('id');

    if (id == undefined)
      this.router.navigateByUrl('/home');

    this._movieService.findById(id)
    .subscribe(res => {
      res = res.json();

      if (!res || !res['movie'])
        return;

      this.movie = res['movie'];
      let t = this.movie.release_date;

      if (!t)
        return;

      t = new Date(t).getFullYear();

      this.url = 'http://localhost:3000/movie/stream/' + this.movie.title + ' ' + t;

      this._movieService.stream(this.url)
      .subscribe(res =>
      {
        console.log('steam started', res);
      })

    })
  }

  logout() {
    this._userService.logout();
  }

}
