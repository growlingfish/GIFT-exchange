import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import moment from 'moment';

@Injectable()
export class FormattingProvider {

  constructor(public http: HttpClient) {}

  doDate (post_date) {
    if (moment(post_date).isBefore(moment(), 'day')) {
      return moment(post_date).format("dddd, MMMM Do YYYY, h:mm a");
    }
    return moment(post_date).fromNow();
  }

}
