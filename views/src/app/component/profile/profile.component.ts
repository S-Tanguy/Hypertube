import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user = { login: 'test', given_name: 'Test', family_name: 'Nom', picture: '' };
  constructor(private _userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    const curentUser = this._userService.getCurrentUser().login;

    // Regarder si c'est le nom de l'utilisateur logger. Si oui, rediriger vers account
    if (username === this._userService.getCurrentUser()) {
      this.router.navigateByUrl('/account');
    } else {
      // fonction pour rechercher le profil
      // this.user = response;
    }
  }

  logout() {
    this._userService.logout();
  }

}
