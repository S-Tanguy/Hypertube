import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { MovieService } from '../../services/movie/movie.service';
import {Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  comments = [];
  newcomment = '';
  movie = {};

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
      console.log(res);
    })
  }

  logout() {
    this._userService.logout();
  }

}
