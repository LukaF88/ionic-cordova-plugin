import { Component } from '@angular/core';
import { Intent } from '@ionic-native/intent/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(intent: Intent) {
    const watch = intent.invoke({
  action: "PLAY",
  directory: "MUSIC",
  file: "eppure_sentire.mp3"
}).subscribe((result) => {
  alert(JSON.stringify(result, undefined, 2));
}, (err) => {
  alert(JSON.stringify(err, undefined, 2));
});
  }

}
