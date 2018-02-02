import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { ActivityPage } from '../pages/activity/activity';
import { ContactsPage } from '../pages/contacts/contacts';
import { GiftcardPage } from '../pages/giftcard/giftcard';
import { IntroPage } from '../pages/intro/intro';
import { InvitePage } from '../pages/invite/invite';
import { KickoutPage } from '../pages/kickout/kickout';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { MyGiftsPage } from '../pages/mygifts/mygifts';
import { NewGiftPage } from '../pages/newgift/newgift';
import { NewMessagePage } from '../pages/newmessage/newmessage';
import { NewObjectPage } from '../pages/newobject/newobject';
import { ObjectsPage } from '../pages/objects/objects';
import { OpenMessagePage } from '../pages/openmessage/openmessage';
import { OpenMyGiftPage } from '../pages/openmygift/openmygift';
import { OpenObjectPage } from '../pages/openobject/openobject';
import { RegisterPage } from '../pages/register/register';
import { RespondPage } from '../pages/respond/respond';
import { ReviewGiftPage } from '../pages/reviewgift/reviewgift';
import { ReviewMessagePage } from '../pages/reviewmessage/reviewmessage';
import { ReviewMyGiftPage } from '../pages/reviewmygift/reviewmygift';
import { ReviewObjectPage } from '../pages/reviewobject/reviewobject';
import { RolePage } from '../pages/role/role';
import { TabsPage } from '../pages/tabs/tabs';
import { TheirGiftsPage } from '../pages/theirgifts/theirgifts';
import { TsAndCsPage } from '../pages/tsandcs/tsandcs';
import { VenueIntroPage } from '../pages/venueintro/venueintro';
import { ViewObjectPage } from '../pages/viewobject/viewobject';

import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FCM } from '@ionic-native/fcm';
import { ImageResizer } from '@ionic-native/image-resizer';
import { NativeAudio } from '@ionic-native/native-audio';
import { Shake } from '@ionic-native/shake';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { VideoPlayer } from '@ionic-native/video-player';

import { UserProvider } from '../providers/user/user';
import { GlobalVarProvider } from '../providers/global-var/global-var';

@NgModule({
  declarations: [
    MyApp,
    ActivityPage,
    ContactsPage,
    GiftcardPage,
    IntroPage,
    InvitePage,
    KickoutPage,
    LoginPage,
    LogoutPage,
    MyGiftsPage,
    NewGiftPage,
    NewMessagePage,
    NewObjectPage,
    ObjectsPage,
    OpenMessagePage,
    OpenMyGiftPage,
    OpenObjectPage,
    RegisterPage,
    RespondPage,
    ReviewGiftPage,
    ReviewObjectPage,
    ReviewMessagePage,
    ReviewMyGiftPage,
    RolePage,
    TabsPage,
    TheirGiftsPage,
    TsAndCsPage,
    VenueIntroPage,
    ViewObjectPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActivityPage,
    ContactsPage,
    GiftcardPage,
    IntroPage,
    InvitePage,
    KickoutPage,
    LoginPage,
    LogoutPage,
    MyGiftsPage,
    NewGiftPage,
    NewMessagePage,
    NewObjectPage,
    ObjectsPage,
    OpenMessagePage,
    OpenMyGiftPage,
    OpenObjectPage,
    RegisterPage,
    RespondPage,
    ReviewGiftPage,
    ReviewObjectPage,
    ReviewMessagePage,
    ReviewMyGiftPage,
    RolePage,
    TabsPage,
    TheirGiftsPage,
    TsAndCsPage,
    VenueIntroPage,
    ViewObjectPage
  ],
  providers: [
    Camera,
    FCM,
    File,
    FilePath,
    FileTransfer, 
    GlobalVarProvider,
    ImageResizer,
    NativeAudio,
    Shake,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    VideoPlayer
  ]
})
export class AppModule {}
