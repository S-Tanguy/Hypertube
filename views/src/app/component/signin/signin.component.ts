import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  user = {username: '', password: ''}

  constructor(private TranslateService: TranslateService)
  {
  }

  ngOnInit() {
  }

}
