import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  upload = false;
  user = { picture: '', login: '', given_name: '', family_name: '', email: '', password: '' }

  constructor() { }

  ngOnInit() {
  }

  uploadPicture(event: any) {
    const pictureFile: HTMLInputElement = event.target || event.srcElement || event.currentTarget;
    const myReader: FileReader = new FileReader();
    let toclean;
    myReader.readAsDataURL(pictureFile.files.item(0));
    // const that = this;
    // myReader.onloadend = function(loadEvent: any) {
    //   toclean = loadEvent.target.result;
    //   that.user.profilepicture = that.base64Clean(toclean);
    //   that._apiService.updateUserProfile(that.user);
  };
  

}
