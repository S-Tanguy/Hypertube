import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = { login: '', given_name: '', family_name: '', picture: '' };


  constructor(private _userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    const curentUser = this._userService.getCurrentUser().login;

    // console.log(username, curentUser)
    if (username === curentUser)
      return (this.router.navigateByUrl('/profile'));

    this._userService.get(username)
    .subscribe(res =>
    {
      res = res.json();

      if (!res || !res['user'])
        return (this.router.navigateByUrl('/home'));

      let tmpUser = this.user,
        user = res['user'],
        key;


      for (key in tmpUser)
        if (tmpUser.hasOwnProperty(key))
          if (user[key])
            this.user[key] = user[key];

      if (!this.user.picture)
        this.user.picture = 'http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png';

    })
  }

  logout() {
    this._userService.logout();
  }

}
