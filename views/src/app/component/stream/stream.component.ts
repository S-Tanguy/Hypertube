import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {
  comments = [];
  newcomment = '';
  movie = {};

  constructor(private _userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const movie = this.route.snapshot.paramMap.get('movie');

    // get movie from back; if does not exist redirect too
    if (!movie) {
      this.router.navigateByUrl('/home');
    }

    // get comments of movie and assign to this.comments
  }

  logout() {
    this._userService.logout();
  }

}
