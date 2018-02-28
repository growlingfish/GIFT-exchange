import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Content } from 'ionic-angular';

@Component({
  selector: 'page-reviewobject',
  templateUrl: 'reviewobject.html',
})
export class ReviewObjectPage {

  @ViewChild(Content) content: Content;
  private object: any;
  private part: number;
  public scrollFAB: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private changeDetector : ChangeDetectorRef) {
    this.object = navParams.get('object');
    this.part = navParams.get('part');
  }

  dismiss () {
    this.viewCtrl.dismiss();
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
