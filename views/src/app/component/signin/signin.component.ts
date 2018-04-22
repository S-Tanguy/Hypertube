import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  user = {username: '', password: ''}

  constructor(private TranslateService: TranslateService, private UserService: UserService)
  {}

  ngOnInit() {
  }

  signin(strategy)
  {
  	
  	this.UserService.signin(null, strategy)
  }
}
