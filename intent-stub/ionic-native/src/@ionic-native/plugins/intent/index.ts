/**
 * This is a template for new plugin wrappers
 *
 * TODO:
 * - Add/Change information below
 * - Document usage (importing, executing main functionality)
 * - Remove any imports that you are not using
 * - Remove all the comments included in this template, EXCEPT the @Plugin wrapper docs and any other docs you added
 * - Remove this note
 *
 */
import { Injectable } from '@angular/core';
import { Plugin, Cordova, CordovaProperty, CordovaInstance, InstanceProperty, IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs';

/**
 * @name Hello World
 * @description
 * This plugin does something
 *
 * @usage
 * ```typescript
 * import { HelloWorld } from '@ionic-native/hello-world';
 *
 *
 * constructor(private helloWorld: HelloWorld) { }
 *
 * ...
 *
 *
 * this.helloWorld.functionName('Hello', 123)
 *   .then((res: any) => console.log(res))
 *   .catch((error: any) => console.error(error));
 *
 * ```
 */
@Plugin({
   pluginName: 'Intent',
  plugin: 'cordova-plugin-intent',
  pluginRef: 'cordova.plugins.Intent', 
  repo: '', // the github repository URL for the plugin
  install: '', // OPTIONAL install command, in case the plugin requires variables
  installVariables: [], // OPTIONAL the plugin requires variables
  platforms: ['Android'] // Array of platforms supported, example: ['Android', 'iOS']
})
@Injectable()
export class Intent extends IonicNativePlugin {

  /**
   * This function does something
   * @param arg1 {string} Some param to configure something
   * @param arg2 {number} Another param to configure something
   * @return {Promise<any>} Returns a promise that resolves when something happens
   */
   @Cordova({
    successIndex : 1,
    errorIndex : 2,
    observable: true
  })
  invoke(options: IntentOptions): Observable<any> {
    return;
  }

export interface IntentOptions {
  _sMessage: string;
}
}
