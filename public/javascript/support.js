function openModalSupport(){
  $('.support.modal')
  .modal('show')
  ;
}

function cancelSupportModal(){
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
  }).then(function(result) {
     alert("ได้รับข้อมูลเรียบร้อยแล้วค่ะ ทางทีมงานจะติดต่อกลับภายใน 24 ชม.");
     $('#support_message').val("");
     $('#support_phonenumber').val("");
     $('.support.modal')
     .modal('hide')
     ;
  }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      if(errorCode == "PERMISSION_DENIED"){
        alert("กรุณาเข้าสู่ระบบก่อนค่ะ")
      }
  });
});
