import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';



@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.css']
})
export class ForgotpwdComponent implements OnInit {
  email = '';
  success = false;
  error = false;
  constructor(private UserService: UserService)
  { }

  ngOnInit() {
  }

  sendMail()
  {
  	this.UserService.reset_pass(this.email)
    .subscribe(res=> {
      this.success = true;
      this.error = false;
    }, (err)=> {
      if (err._body) {
        this.error = true;
        this.success = false;
      }
    })
  }

}
