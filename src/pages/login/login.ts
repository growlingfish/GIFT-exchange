import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { TsAndCsPage } from '../tsandcs/tsandcs';
import { LogoutPage } from '../logout/logout';
import { KickoutPage } from '../kickout/kickout';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { GlobalVarProvider } from '../../providers/global-var/global-var';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  username: string;
  password: string;
  venues: Array<Object>;
  venue: Object;
  loading: Loading;
  selectOptions = {
    title: 'Which venue are you visiting?',
    subTitle: 'Choose the appropriate venue from this list'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private globalVarProvider: GlobalVarProvider, private userProvider: UserProvider, private loadingCtrl: LoadingController, private iab: InAppBrowser) {
    //this.venue = null;
  }

  ionViewWillEnter () {
    this.userProvider.getUser().then(data => {
      if (data == null) {
        this.showLoading();
        this.userProvider.updateVenues().subscribe(complete => {
          if (complete) {
            this.userProvider.getVenues().then(venues => {
              this.venues = venues;
              this.loading.dismiss();
            });
          } else {
            this.navCtrl.setRoot(KickoutPage);
          }
        }, error => {
          this.navCtrl.setRoot(KickoutPage);
        });
      } else {
        this.showLoading();
        this.userProvider.initialiseData().subscribe(success => {
          if (!success) {
            this.userProvider.logout().then(data => {
              this.navCtrl.setRoot(KickoutPage);
            });
          }
        }, error => {
          this.userProvider.logout().then(data => {
            this.navCtrl.setRoot(KickoutPage);
          });
        }, () => {
          this.userProvider.getVenue().then(venue => {
            this.userProvider.initialiseFCM();
            this.navCtrl.setRoot(LogoutPage);
          });
        });
      }
    });
  }

  login() {
    this.showLoading();
    this.userProvider.login(this.username, this.password, this.venue).subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.showError("Your email address or password was incorrect. Check them and try again.");
      }
    },
    error => {
      this.showError(error);
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Login unsuccessful',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  register () {
    if (!!this.venue) {
      this.userProvider.setVenue(this.venue).then(data => {
        this.navCtrl.push(TsAndCsPage);
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'Choose a venue',
        subTitle: 'Please choose a venue before registering.',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }

  resetPassword () {
    this.iab.create(this.globalVarProvider.getPasswordResetURL());
  }
}
