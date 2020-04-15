/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { NbAuthSimpleToken, NbAuthTokenClass } from '../../services/token/token';
import { NbAuthStrategyOptions } from '../auth-strategy-options';
import { getDeepFromObject } from '../../helpers';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface NbNtkcmsStrategyModule {
  alwaysFail?: boolean;
  endpoint?: string;
  method?: string;
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  requireValidToken?: boolean;
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface NbNtkcmsStrategyReset extends NbNtkcmsStrategyModule {
  resetPasswordTokenKey?: string;
}

export interface NbNtkcmsStrategyToken {
  class?: NbAuthTokenClass,
  key?: string,
  getter?: Function,
}

export interface NbNtkcmsStrategyMessage {
  key?: string,
  getter?: Function,
}

export class NbNtkcmsAuthStrategyOptions extends NbAuthStrategyOptions {
  baseEndpoint? = 'https://apicms.ir/api/auth/';
  //baseEndpoint? = 'http://localhost:2390/api/auth/';
  login?: boolean | NbNtkcmsStrategyModule = {
    alwaysFail: false,
    endpoint: 'signIn',///'login',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Login/Email combination is not correct, please try again.'],
    defaultMessages: ['You have been successfully logged in.'],
  };
  register?: boolean | NbNtkcmsStrategyModule = {
    alwaysFail: false,
    endpoint: 'register',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully registered.'],
  };
  requestPass?: boolean | NbNtkcmsStrategyModule = {
    endpoint: 'request-pass',
    method: 'post',
    redirect: {
      success: '/',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Reset password instructions have been sent to your email.'],
  };
  resetPass?: boolean | NbNtkcmsStrategyReset = {
    endpoint: 'reset-pass',
    method: 'put',
    redirect: {
      success: '/',
      failure: null,
    },
    resetPasswordTokenKey: 'reset_password_token',
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your password has been successfully changed.'],
  };
  logout?: boolean | NbNtkcmsStrategyReset = {
    alwaysFail: false,
    endpoint: 'signOut',
    method: 'post',//'delete',
    redirect: {
      success: '/auth/login',
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['You have been successfully logged out.'],
  };
  refreshToken?: boolean | NbNtkcmsStrategyModule = {
    endpoint: 'refresh-token',
    method: 'post',
    requireValidToken: false,
    redirect: {
      success: null,
      failure: null,
    },
    defaultErrors: ['Something went wrong, please try again.'],
    defaultMessages: ['Your token has been successfully refreshed.'],
  };
  token?: NbNtkcmsStrategyToken = {
    class: NbAuthSimpleToken,
    key: 'token',//'data.token',
    getter: (module: string, res: HttpResponse<Object>, options: NbNtkcmsAuthStrategyOptions) => getDeepFromObject(
      res.body,
      options.token.key,
    ),
  };
  errors?: NbNtkcmsStrategyMessage = {
    key: 'ErrorMessage',//key: 'data.errors',
    getter: (module: string, res: HttpErrorResponse, options: NbNtkcmsAuthStrategyOptions) => getDeepFromObject(
      res.error,
      options.errors.key,
      options[module].defaultErrors,
    ),
  };
  messages?: NbNtkcmsStrategyMessage = {
    key: 'ErrorMessage',//key: 'data.messages',
    getter: (module: string, res: HttpResponse<Object>, options: NbNtkcmsAuthStrategyOptions) => getDeepFromObject(
      res.body,
      options.messages.key,
      options[module].defaultMessages,
    ),
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}

export const ntkcmsStrategyOptions: NbNtkcmsAuthStrategyOptions = new NbNtkcmsAuthStrategyOptions();
