import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';



@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent implements OnInit {
  email = '';
  constructor(private UserService: UserService)
  { }

  ngOnInit() {
  }

  sendMail()
  {
  	console.log(this.email)
  	this.UserService.reset_pass(this.email)
    .subscribe(res=>console.log(res))
  }

}
