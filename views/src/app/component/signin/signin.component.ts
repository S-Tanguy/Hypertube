import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user/user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  user = {login: '', password: ''};

  constructor(private TranslateService: TranslateService, private UserService: UserService, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
  this.activatedRoute.queryParams.subscribe((params: Params) => {
    if (params['token'])
    	this.UserService.strategySignin(params['token'])
  });
}

  signin(strategy) {
    this.UserService.signin(this.user, strategy);
  }
}
