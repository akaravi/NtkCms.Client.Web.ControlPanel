import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cmsServerConfig } from 'app/@cms/cmsCommon/environments/cmsServerConfig';
import { map } from 'rxjs/operators';

@Injectable()
export class CmsAuthService {
  token: string;
  baseUrl = cmsServerConfig.configApiServerPath + 'auth/';

  constructor(private http: HttpClient) {}

  signupUser(model: any) {
    //your code for signing up the new user
  }

  signinUser(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((user: any) => {
        if (user) {
          //store
          //this.store.dispatch(new fromStore.EditLoggedUser(user.user));
          //const decodedToken = this.jwtHelper.decodeToken(user.token);
          //this.store.dispatch(new fromStore.EditDecodedToken(decodedToken));
          //this.userRoles = decodedToken.role as Array<string>;

          localStorage.setItem('token', user.token);
          localStorage.setItem('refreshToken', user.refresh_token);
        }
      })
    );
  }

  logout() {
    this.token = null;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    // here you can check if user is authenticated or not through his token
    return true;
  }
}
