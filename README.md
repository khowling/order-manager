
sudo npm -g install cordova

cordova create <app_name> org.khowling.<app_name> <longername>
cordova plugin add https://github.com/forcedotcom/SalesforceMobileSDK-CordovaPlugin

cordova plugin add org.apache.cordova.console
cordova plugin add cordova-plugin-statusbar
cordova plugin add org.apache.cordova.network-information
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.media-capture
cordova plugin add org.apache.cordova.media
cordova plugin add org.apache.cordova.splashscreen
cordova plugin add org.apache.cordova.file
cordova plugin add org.apache.cordova.file-transfer
cordova platform add ios

generate icons : makeappicon.com
generate splash : http://ticons.fokkezb.nl

cp in the application 'www' files
cordova prepare
cordova build
cordova emulate ios  --debug --target="iPad"

tail -f  platforms/ios/cordova/console.log

to run on attached device::

npm install -g ios-deploy (need version 1.4.0)
cordova build ios --device
cordova run ios --device


to deploy:

cordova build ios --release --device (--release builds 64bit required for upload to ituens connect)

To upload the file to itunes connect and use 'testflight', In the Members section:
Create Signing Certification for Production: "iPhone Distribution: Keith Howling (573FQ9AHHA)"
Generate Distribution Provisioning Profile (usng Signing Cert): "Test_Profile_.mobileprovision"

add this in the config.xml, to target only arm64 (8.0, as the msdk doesnt appear to have the required slices for the other arhcitectures)

<preference name="deployment-target" value="7.0" />

edit: platforms/ios/cordova/lib/build.js, change from 'ARCHS=armv7 armv7s arm64' 'ARCHS=arm64'

edit platforms/ios/build/device/<OrderManager>.app/plist.list in Xcode and add
"UIRequiredDeviceCapabilities" <array> - 1st element "arm64"

Download the CodeSigning Certificate from the apple member site (double-click to ensure it goes into the machines keychain)  - then use the Certificate name in the --sign parameter.

xcrun -sdk iphoneos PackageApplication -v ./platforms/ios/build/device/OrderManager.app  -o "/Users/keithhowling/OrderManager.ipa" --embed ../Downloads/Test_Profile_.mobileprovision --sign "iPhone Distribution: Keith Howling (573FQ9AHHA)"

upload app using : Application Loader
use itunes Connect to test flight.

To just distribute the app ipa file without itunes connect:

download the “AD Hoc (iOS Distrubution)” provisioning profile (containing the development signing certification and the device ids), the use the filename in the --embed parameter.
--sign parameters needs the name of the certificate (download from the member center and click on it, and ctrlC the cert name)

xcrun -sdk iphoneos PackageApplication -v ./platforms/ios/build/device/OrderManager.app  -o "/Users/keithhowling/OrderManagerMatt.ipa" --embed ../Downloads/AdHocforMatt.mobileprovision --sign "iPhone Developer: Ki Smith (7EWDESBS72)"





check the file is signed OK

codesign -v perfectosa.ipa
