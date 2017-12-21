import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-viewobject',
  templateUrl: 'viewobject.html',
})
export class ViewObjectPage {

  private object: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.object = navParams.get('object');
  }

  use () {
    this.viewCtrl.dismiss(true);
  }

  cancel () {
    this.viewCtrl.dismiss(false);
  }

}
