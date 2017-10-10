// Initialize Firebase
var config = {
  apiKey: "AIzaSyBx9VgPDcirdmm21Is_ujENdjE-drKwtD8",
  authDomain: "hubspace-01.firebaseapp.com",
  databaseURL: "https://hubspace-01.firebaseio.com",
  projectId: "hubspace-01",
  storageBucket: "hubspace-01.appspot.com",
  messagingSenderId: "806359360193"
};
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
var provider = new firebase.auth.FacebookAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var user = firebase.auth().currentUser;
    var name, email, photoUrl, uid, emailVerified;
    if (user != null) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoURL;
      uid = user.uid;
      $("#account_ui").html(
        `
          <img class="ui avatar image" src="${photoUrl}">
          <div class="content">
              <a class="header">${name}</a>
              <div class="description">${email}</div>
          </div>
          <div class="right floated content" style="margin-left:10px;">
            <div class="ui button" onclick="signOut()">ออกจากระบบ</div>
          </div>
      `);
    }
  }else{
    $("#account_ui").html(
      `
        <button class="loginBtn loginBtn--facebook" onclick="signIn()">
          เข้าสู่ระบบด้วย Facebook
        </button>
    `);
  }
});

function signIn(){
  firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
   }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
   });
}

function signOut(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}
