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

  constructor(private _userService: UserService) { }

  ngOnInit() {
    const curentUser = this._userService.getCurrentUser();

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

    this._userService.langUpdated.subscribe(bool => {
      if (bool === true) {
        location.reload();
      }
    });
  }

  changeLang(e) {
    const { lang } = this.user;

    this._userService.update({lang});
    localStorage.setItem('lang', lang);
  }

  passwordMatch() {
    if (this.password !== this.repeatpwd) {
      this.noMatch = true;
    } else {
      this.noMatch = false;
    }
  }

  updateProfile() {
    const {email, login, given_name, family_name} = this.user;
    this._userService.update({email, login, given_name, family_name});
  }

  changePassword(e) {
    const {email, login, password} = this.user;
    this._userService.update({email, login, password});
  }

  base64Clean(base64) {
    const marker = ';base64,';
    const base64Index = base64.indexOf(marker) + marker.length;
    const base64string = base64.substring(base64Index);
    const test = 'data:image/jpeg;base64,' + base64string;
    return (test);
  }

  uploadPicture(event: any) {
    const pictureFile: HTMLInputElement = event.target || event.srcElement || event.currentTarget;
    const myReader: FileReader = new FileReader();
    let toclean;
    myReader.readAsDataURL(pictureFile.files.item(0));
    const that = this;
    myReader.onloadend = function(loadEvent: any) {
      toclean = loadEvent.target.result;
      that.user.picture = that.base64Clean(toclean);
      const {login, picture} = that.user;
      that._userService.update({login, picture});
    };
  }

}
