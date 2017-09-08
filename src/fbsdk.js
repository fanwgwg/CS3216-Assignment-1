console.log("remember to change app Id in fbsdk.js and domain in class variable of App.tsx while testing");
FB.init({
  // appId: '196392960900707',
   appId: '847275338755067',
  xfbml: true,
  version: 'v2.10'
});
//FB.AppEvents.logPageView();

// function runFbInitCriticalCode() {
//   var script = document.createElement("script"); //Make a script DOM node
//   script.src = './dist/app.js'; //Set it's src to the provided URL
//   document.body.appendChild(script);
// }

// window.fbAsyncInit = function () {
//   FB.init({
//     //appId: '196392960900707',
//     appId: '847275338755067',
//     xfbml: true,
//     version: 'v2.10'
//   });
//   console.log("init");
//   FB.AppEvents.logPageView();
// };

// (function (d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) { return; }
//   js = d.createElement(s); js.id = id;
//   js.src = "//connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
// function testAPI() {
//   console.log('Welcome!  Fetching your information.... ');
//   FB.api('/me', function (response) {
//     console.log('Successful login for: ' + response.name + response.id);
//   });
// }
