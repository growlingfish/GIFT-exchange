import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

import { IntroPage } from '../intro/intro';

@Component({
  selector: 'page-kickout',
  templateUrl: 'kickout.html',
})
export class KickoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private app: App) {
  }

  logout () {
    this.app.getRootNav().setRoot(IntroPage);
  }
}
