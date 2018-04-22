import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user = { picture: '', login: '', given_name: '', family_name: '', email: '', password: '', language: 'en' }
  noMatch = true;
  password = '';
  repeatpwd = '';
  upload = false;

  constructor() { }

  ngOnInit() {
  }

  changeLang() {

  }

  passwordMatch() {
    if (this.password !== this.repeatpwd) {
      this.noMatch = true;
    } else {
      this.noMatch = false;
    }
  }

  updateProfile() {

  }

  changePassword() {

  }

  uploadPicture(event) {

  }

}
