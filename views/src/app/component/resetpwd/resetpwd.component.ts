import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent implements OnInit {
  noMatch = true;
  password = '';
  repeatpwd = '';
  pass_reset = '';

  constructor(private _userService: UserService, private route: ActivatedRoute, private router: Router)
  { }

  ngOnInit() {
    this.pass_reset = this.route.snapshot.paramMap.get('pass_reset');

    console.log(this.pass_reset)
  }

  passwordMatch() {
    if (this.password !== this.repeatpwd) {
      this.noMatch = true;
    } else {
      this.noMatch = false;
    }
  }

  changePassword() {
    // let {email, login, password} = this.user;
    console.log('sd')
    this._userService.update_pass_reset({pass_reset: this.pass_reset, password: this.password})
    .subscribe(res => console.log(res));
    
  }

}
