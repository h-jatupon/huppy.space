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

$("#loginform").submit(function (e) {
    e.preventDefault();
    alert("ระบบจะเปิดให้บริการในวันที่ 1 ธันวาคม 2560");
});


function openModalSupport() {
    $('.support.modal')
        .modal('show')
        ;
}

function cancelSupportModal() {
    $('.support.modal')
        .modal('hide')
        ;
}

$("#support_form").submit(function (e) {
    e.preventDefault();
    var message = $('#support_message').val();
    var phoneNumber = $('#support_phonenumber').val();

    var supportRef = firebase.database().ref('CustomerSupport/');
    var newPostRef = supportRef.push();
    newPostRef.set({
        phoneNumber: phoneNumber,
        message: message
    }).then(function (result) {
        alert("ได้รับข้อมูลเรียบร้อยแล้วค่ะ ทางทีมงานจะติดต่อกลับภายใน 24 ชม.");
        $('#support_message').val("");
        $('#support_phonenumber').val("");
        $('.support.modal')
            .modal('hide')
            ;
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
});
