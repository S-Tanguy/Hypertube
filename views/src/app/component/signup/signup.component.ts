import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';

import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  upload = false;
  user = { picture: '', login: '', given_name: '', family_name: '', email: '', password: '' }

  constructor(private TranslateService: TranslateService, private UserService: UserService, private sanitizer: DomSanitizer)
  { }


  ngOnInit() {
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
    };
  }


  signup()
  {
  	console.log(this.user)
  	this.UserService.signup(this.user);
  }

}
