import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-venueintro',
  templateUrl: 'venueintro.html',
})
export class VenueIntroPage {

  venue: Object;

  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    this.venue = navParams.get('venue');
  }

  continue () {
    this.viewCtrl.dismiss();
  }

}
