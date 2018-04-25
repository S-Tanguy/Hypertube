import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule} from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user.service';
// import { AppTranslationModule } from './app.translation.module';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';


import { AppComponent } from './app.component';
import { SigninComponent } from './component/signin/signin.component';
import { SignupComponent } from './component/signup/signup.component';
import { ForgotpwdComponent } from './component/forgotpwd/forgotpwd.component';
import { HomeComponent } from './component/home/home.component';
import { AccountComponent } from './component/account/account.component';
import { ProfileComponent } from './component/profile/profile.component';
import { StreamComponent } from './component/stream/stream.component';


const appRoutes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgotPassword', component: ForgotpwdComponent },
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent },
  { path: ':token', component: SigninComponent }
];

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    ForgotpwdComponent,
    HomeComponent,
    AccountComponent,
    ProfileComponent,
    StreamComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  }),
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    // let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'en';
    // translate.use(lang)
    translate.use('en');
  }
}
