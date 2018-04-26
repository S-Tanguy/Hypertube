import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthGuardGuard implements CanActivate {
  constructor(public _userService: UserService, private router: Router) {}
  
  canActivate() {
    if (this._userService.loggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
