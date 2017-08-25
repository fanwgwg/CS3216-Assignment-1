
window.fbAsyncInit = function () {
  FB.init({
    appId: '196392960900707',
    //appId: '847275338755067',
    xfbml: true,
    version: 'v2.10'
  });
  console.log("init");
  FB.AppEvents.logPageView();
  FB.getLoginStatus(function (response) {
  });
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function (response) {
    console.log('Successful login for: ' + response.name + response.id);
  });
}
