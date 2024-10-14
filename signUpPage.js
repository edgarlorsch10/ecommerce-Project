let formIsvalid;
let digitPattern=/[0-9]/;
let lowercaseLetterPattern=/[a-z]/;
let uppercaseLetterPattern=/[A-Z]/;
let phoneWithZeroOnePattern=/^01\d{8}/;
let phoneWithZeroSevenPattern=/^07\d{8}/;
let signUpForm=document.querySelector("#signUpForm");
let username=document.querySelector("#username");
let userNameError=document.querySelector("#userNameError");
let userTelephone=document.querySelector("#userTelephone");
let userTelephoneError=document.querySelector("#userTelephoneError");
let userEmailAddress=document.querySelector("#userEmailAddress");
let emailAddressError=document.querySelector("#emailAddressError");
let userpassword=document.querySelector("#userpassword");
let userpasswordError=document.querySelector("#userpasswordError");
let submitSignUpDetails=document.querySelector("#submitSignUpDetails");
submitSignUpDetails.addEventListener("click",(e)=>{
  e.preventDefault();
  userNameError.textContent="";
  userTelephoneError.textContent="";
  emailAddressError.textContent="";
  userpasswordError.textContent="";
 if(username.value==="")userNameError.textContent="Fill in your name.";
 if(username.value!==""&&username.value.length<3)userNameError.textContent="Your name has to be at least 3 charcters long";
 if(userTelephone.value=="")userTelephoneError.textContent="Fill in your number.";
 if(userTelephone.value!==""&&phoneWithZeroOnePattern.test(userTelephone.value)===false&&userTelephone.value!==""&&phoneWithZeroSevenPattern.test(userTelephone.value)===false)userTelephoneError.textContent="Incorrect formart";
 if(userEmailAddress.value==="")emailAddressError.textContent="Kindly provide your email address for contacting.";
 if(userEmailAddress.value!==""&&userEmailAddress.validity.typeMismatch)emailAddressError.textContent="Ensure the email address provided is valid.";
 if(userpassword.value=="")userpasswordError.textContent="Kindly provide a password for your new account.";
 if(userpassword.value!==""&&userpassword.value.length<6)userpasswordError.textContent="Your password should not be less than 6 characters long.";
 if(userpassword.value!==""&&userpassword.value.length>12)userpasswordError.textContent="Your password should not be longer than 12 characters.";
 if(userpassword.value!==""&&userpassword.value.length<6===false&&userpassword.value.search(digitPattern)<0||userpassword.value.length>12===false&&userpassword.value.length>12===false&&userpassword.value.search(digitPattern)<0)userpasswordError.textContent="Your password should contain a digit.";
 if(userpassword.value!==""&&userpassword.value.length<6===false&&userpassword.value.search(lowercaseLetterPattern)<0||userpassword.value!==""&&userpassword.value.length>12===false&&userpassword.value.search(lowercaseLetterPattern)<0)userpasswordError.textContent="Your password should contain a lowercase letter.";
 if(userpassword.value!==""&&userpassword.value.length<6===false&&userpassword.value.search(uppercaseLetterPattern)<0||userpassword.value!==""&&userpassword.value.length>12===false&&userpassword.value.search(uppercaseLetterPattern)<0)userpasswordError.textContent="Your password should contain an uppercase letter.";
 if(userNameError.textContent!==""||userTelephoneError.textContent!==""||emailAddressError.textContent!==""||userpasswordError.textContent!=="")formIsvalid=false;
 if(userNameError.textContent===""&&userTelephoneError.textContent===""&&emailAddressError.textContent===""&&userpasswordError.textContent===""){
  formIsvalid=true;
  userAccount.clientPassword=userpassword.value;
  userAccount.clientEmailaddress=userEmailAddress.value;
  alert(`Hello ${username.value},your data has been successfully submitted to the databse.`);
  signUpForm.reset();
 }
 });
 