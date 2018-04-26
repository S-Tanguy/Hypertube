import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';



@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user = { picture: '', login: '', given_name: '', family_name: '', email: '', password: '', lang: 'en' };
  noMatch = true;
  password = '';
  repeatpwd = '';
  is_local_strategy = false;
  upload = false;

  constructor(private UserService: UserService) { }

  ngOnInit() {
    let curentUser = this.UserService.getCurrentUser();

    console.log(curentUser);
    this.user = {
      picture: curentUser.picture,
      login: curentUser.login,
      given_name: curentUser.given_name,
      family_name: curentUser.family_name,
      email: curentUser.email,
      password: curentUser.password,
      lang: curentUser.lang
    };
    this.is_local_strategy = curentUser.provider === 'local';
  }

  changeLang(e) {
    let { lang } = this.user;

    this.UserService.update({lang});
  }

  passwordMatch() {
    if (this.password !== this.repeatpwd) {
      this.noMatch = true;
    } else {
      this.noMatch = false;
    }
    console.log(this.user)
  }

  updateProfile() {
    let {email, login, given_name, family_name} = this.user;
    this.UserService.update({email, login, given_name, family_name})
  }

  changePassword() {
    console.log(this.user);
  }

  uploadPicture(event) {

  }

}
