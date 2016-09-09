/**
 * Created by andywiranatawijaya on 6/15/16.
 */
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDRuCN0SRkbHKv6hathgYXmHaZ-twySMzo",
    authDomain: "dev-sayurbox.firebaseapp.com",
    databaseURL: "https://dev-sayurbox.firebaseio.com",
    storageBucket: "dev-sayurbox.appspot.com",
};

var firebaseRef = firebase.initializeApp(config);

try{
    localStorage.test=3;
}catch(e){
    window.location.replace(window.location.origin+"/#/browserNotSupported");
}
