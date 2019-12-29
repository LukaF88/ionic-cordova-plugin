import { Component } from '@angular/core';
import { Intent } from '@ionic-native/intent/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(intent: Intent, private androidPermissions: AndroidPermissions) {

   /* this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    );
    */
    alert("Inizio");
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(data => {
                    //# meskipun do not shw again, ttp masuk sini value false.
                    alert("-> " + data.hasPermission);
                    if (data.hasPermission) {
                        alert("OK")
                          const watch = intent.invoke({
                          action: "LIST",
                          directory: "MUSIC",
                          file: "eppure_sentire.mp3"
                        }).subscribe((result) => {
                          alert(JSON.stringify(result, undefined, 2));
                        }, (err) => {
                          alert(JSON.stringify(err, undefined, 2));
                        });
                    }
    })

  }
}
