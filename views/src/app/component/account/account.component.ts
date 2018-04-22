import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  user = { picture: '', login: '', given_name: '', family_name: '', email: '', password: '', language: 'en' }
  
  constructor() { }

  ngOnInit() {
  }

  changeLang() {

  }

}
