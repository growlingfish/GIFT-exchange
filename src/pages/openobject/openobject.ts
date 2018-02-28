import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Content } from 'ionic-angular';

@Component({
  selector: 'page-openobject',
  templateUrl: 'openobject.html',
})
export class OpenObjectPage {

  @ViewChild(Content) content: Content;
  private object: any;
  private part: number;
  public scrollFAB: boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, private changeDetector : ChangeDetectorRef) {
    this.object = navParams.get('object');
    this.part = navParams.get('part');
  }

  found () {
    this.viewCtrl.dismiss({
      found: true
    });
  }
  
  dismiss () {
    this.viewCtrl.dismiss({
      found: false
    });
  }

  help () {
    let alert = this.alertCtrl.create({
      title: "Here's a hint",
      subTitle: "This object is in: " + this.object.location.post_title,
      buttons: ['OK']
    });
    alert.present();
  }

  ionViewDidLoad () {
    setTimeout(function() {
      var diff = this.content.scrollHeight - this.content.contentHeight;
      if (diff > 0) {
        this.scrollFAB = true;
        this.changeDetector.detectChanges();
        this.content.ionScroll.subscribe((scroll) => {
          if (scroll.scrollTop < 0.8 * diff) {
            this.scrollFAB = true;
          } else {
            this.scrollFAB = false;
          }
          this.changeDetector.detectChanges();
        });
      }
    }.bind(this), 1000);
  }

}
