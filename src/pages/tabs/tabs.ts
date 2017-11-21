import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { TheirGiftsPage } from '../theirgifts/theirgifts';
import { MyGiftsPage } from '../mygifts/mygifts';
import { ActivityPage } from '../activity/activity';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  makeRoot = TheirGiftsPage;
  unwrapRoot = MyGiftsPage;
  activityRoot = ActivityPage;

  selectedTab: number;

  constructor(public navParams: NavParams) {
    this.selectedTab = navParams.get('tab') || 0;
  }

  // UNFINISHED
}
