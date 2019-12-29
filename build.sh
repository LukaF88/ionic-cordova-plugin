# INIT PROJECT
ionic start ionic-prova-cordova-plugin blank
cd ionic-prova-cordova-plugin
ionic cordova platform add android
cd ..

#INSTALL PlUGIN
cd ionic-prova-cordova-plugin
ionic cordova plugin remove cordova-plugin-intent
ionic cordova plugin add ../Intent
cd ..
#read -p "Plugin installed..."

#INSTALL STUB
cd intent-stub
git clone https://github.com/ionic-team/ionic-native/
cd ionic-native
npm install
gulp plugin:create -n Intent
yes | cp -rf ../index.ts ../ionic-native/src/@ionic-native/plugins/intent/
npm run build Intent
cd ..
cd ..
cd ionic-prova-cordova-plugin
#npm install --save D:/workspaces/projects/prove/Intent/intent-stub/ionic-native/dist/@ionic-native/plugins/intent
#read -p "Installato stub..."
yes | cp -rf ../intent-stub/ionic-native/dist/@ionic-native/plugins/intent ./node_modules/@ionic-native
cp -r ../app.module.ts ./src/app/app.module.ts
cp -r ../home.page.ts ./src/app/home/home.page.ts
cd ..
