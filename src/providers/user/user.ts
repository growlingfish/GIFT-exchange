import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

@Injectable()
export class UserProvider {

  constructor(public http: HttpClient,  private storage: Storage) {}

  public getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

}
