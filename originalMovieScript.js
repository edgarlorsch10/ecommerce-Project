let view;
let allLinks=document.querySelectorAll("a");
allLinks.forEach((link)=>{
    link.addEventListener("click",function (e){
        e.preventDefault();//since my aim is to create an spa, I want the app to avoid reloading the page upon every click of a link
        history.pushState(view,"",e.target.href);//I've used the history object to create a new entry in the history stack, whenever a link is clicked. event.target.href refers to the url of the newly created entry
      updatePageUI();
      })
});
let mainSection=document.querySelector("#mainSection");
let movieSection=document.querySelector("#movieSection");
let myScifiMovies=document.querySelector("#myScifiMovies");
let myActionMovies=document.querySelector("#myActionMovies");
let myAdventureMovies=document.querySelector("#myAdventureMovies");
let myComedyMovies=document.querySelector("#myComedyMovies");
let myHorrorMovies=document.querySelector("#myHorrorMovies");
let firstSection=document.querySelector("#firstSection");
let unalteredPage=[];
let formIsvalid;//This will assist me in checking whether the form is ready for submission
let registeredUsers=localStorage.getItem("accountUsers")?JSON.parse(localStorage.getItem("accountUsers")):[];
let copyOfRegisteredUsers=[];//I've created this array to hold a copy of the users who have just registered or signed up, just incase data gets lost in one reference array, it can act as backup
copyOfRegisteredUsers=registeredUsers;
let userAccount={};
let submittedDetailsAccount={}; //I've created this object with a purpose to store the email and password that a user will submit while logging in,I'll compare it to the original details submitted during sign up to confirm whether its the same user trying to access their account
let affectedUserInformation={};//If it is indeed true that this user's email exists, I will ensure this object has two properties with the values of the affected client's email and the answer to their security question
let affectedClients=localStorage.getItem("affectedUser")?JSON.parse(localStorage.getItem("affectedUser")):[];
let digitPattern=/[0-9]/;
let lowercaseLetterPattern=/[a-z]/;
let uppercaseLetterPattern=/[A-Z]/;
let phoneWithZeroOnePattern=/^01\d{8}/;
let phoneWithZeroSevenPattern=/^07\d{8}/;
let loginPasswordAvailable;
let loginEmailAvailable;
unalteredPage.push(movieSection.innerHTML);
let displayScifiView=()=>myScifiMovies.innerHTML;
let displayActionView=()=>myActionMovies.innerHTML;
let displayAdventureView=()=>myAdventureMovies.innerHTML;
let displayComedyView=()=>myComedyMovies.innerHTML;
let displayHorrorView=()=>myHorrorMovies.innerHTML;
let clientAccountPresent;//This will be especially helpful when the client clicks on the person icon and the login page is displayed, it will return true if the user's details exist
let userAccountConfirmation;//Whenever a user performs an add to cart operation, its value will be instantiated
//The following  function will assist me change the look of the <section> element depending on which link is clicked on
function updatePageUI(){
    let path=window.location.pathname;//I've initialised the path variable which will refer to the location of a particular url
    switch(path){
        case "/scifi":
       movieSection.innerHTML=displayScifiView();
        break;
        case "/action":
        movieSection.innerHTML=displayActionView();
        break;
        case "/adventure":
       movieSection.innerHTML=displayAdventureView();
        break;
        case "/comedy":
       movieSection.innerHTML=displayComedyView();
        break;
       case "/horror":
       movieSection.innerHTML=displayHorrorView();
        break;
        default:
       movieSection.innerHTML=unalteredPage;
        break;
    }
    view=movieSection.innerHTML;
  }
(function initializePageUI(){
 let path=window.location.pathname;
    history.replaceState(movieSection.innerHTML,"");
})();
function createSignUpForm(){
  movieSection.innerHTML=`
  <form id="signUpForm" novalidate>
  <div class="mb-3">
                    <label for="username">Enter Your Name Here:</label>
                                <input type="text" id="username" name="username"/>
                    <p id="userNameError"></p>
                    </div>
                    <div class="mb-3">
                    <label for="userTelephone">Enter Your Telephone Number Here:</label>
                    <input type="number" id="userTelephone" name="userTelephone"/>
                    <p id="userTelephoneError"></p>
                    </div>
                    <div class="mb-3">
                    <label for="userEmailAddress">Enter Your Email Address Here:</label>
                    <input type="email" id="userEmailAddress" name="userEmailAddress">
                    <p id="emailAddressError"></p>
                    </div>
                    <div class="mb-3">
                   <label for="userpassword">Enter Your Password:</label><br>
                   <input type="password" id="userpassword">
                   <p id="userpasswordError"></p>
                   </div>
                    <button id="submitSignUpDetails" type="submit">Sign Up</button>
        </form>  `;
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
           let passwordNotNull=userpassword.value!=="";
         let passwordNotLessThanSixCharacters=userpassword.value.length<6===false;
         let passwordNotGreaterThanTwelveCharacters=userpassword.value.length>12===false;
         let passwordContainsLowercase=userpassword.value.search(lowercaseLetterPattern)>=0;
         let passwordContainsUppercase=userpassword.value.search(uppercaseLetterPattern)>=0;
         let passwordContainsDigit=userpassword.value.search(digitPattern)>=0;
         if(!passwordNotNull)userpasswordError.textContent="Create a password for your account.";
         if(passwordNotNull&&!passwordNotLessThanSixCharacters)userpasswordError.textContent="Your password should not be less than 6 characters long.";
         if(passwordNotNull&&!passwordNotGreaterThanTwelveCharacters)userpasswordError.textContent="Your password should not be longer than 12 characters long.";
         if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsLowercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsLowercase)userpasswordError.textContent="Your password should contain a lowercase letter.";
         if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsUppercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsUppercase)userpasswordError.textContent="Your password should contain an uppercase letter.";
         if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsDigit||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsDigit)userpasswordError.textContent="Your password should contain a digit.";
         if(userNameError.textContent===""&&userTelephoneError.textContent===""&&emailAddressError.textContent===""&&userpasswordError.textContent===""){
          userAccount.clientPassword=userpassword.value;
          userAccount.clientEmailaddress=userEmailAddress.value;
          clientAccountPresent=registeredUsers.some(registeredUser=>registeredUser.clientEmailaddress===userAccount.clientEmailaddress);
          if(clientAccountPresent){
            alert(`Hello there ${username.value}, the email address ${userEmailAddress.value} already exists in our system. Kindly log in to access your account.`)
            setTimeout(()=>{
            signUpForm.reset()
            createLoginForm();
           },800);
          }
          if(!clientAccountPresent){
            registeredUsers.push(userAccount);
            alert(`Hello ${username.value}, you have successfully created your account. The data has been successfully submitted.`);
            localStorage.setItem("accountUsers",JSON.stringify(registeredUsers));
            formIsvalid=true;
            signUpForm.reset();
          }
        }
         });
}
let forgotPasswordButton=document.createElement("button");
forgotPasswordButton.textContent="Forgot Password";
let forgotPasswordClickCount=0;
let loginButtonClickCount=0;
function createLoginForm(){
  movieSection.innerHTML=`  <form id="loginForm" novalidate role="form">
  <label for="loginEmail">Enter Your Email Address Here:
  <input type="email" id="loginEmail" name="loginEmail"/>
  </label>
  <p id="loginEmailError"></p>
  <label for="loginpassword">Enter Your Password:</label>
  <input type="password" id="loginpassword" name="loginpassword">
  <p id="loginpasswordError"></p>
  <button id="loginButton" type="submit">Login</button>
</form> `
let loginEmail=document.querySelector("#loginEmail");
let loginEmailError=document.querySelector("#loginEmailError");
let loginpassword=document.querySelector("#loginpassword");
let loginpasswordError=document.querySelector("#loginpasswordError");
let loginButton=document.querySelector("#loginButton");
loginButton.addEventListener("click",(e)=>{
e.preventDefault();
loginButtonClickCount++;
loginEmailError.textContent="";
loginpasswordError.textContent="";
let emailNotNull=loginEmail.value!=="";
let emailValid=loginEmail.validity.typeMismatch===false;
let passwordNotNull=loginpassword.value!=="";
let passwordNotLessThanSixCharacters=loginpassword.value.length<6===false;
let passwordNotGreaterThanTwelveCharacters=loginpassword.value.length>12===false;
let passwordContainsLowercase=loginpassword.value.search(lowercaseLetterPattern)>=0;
let passwordContainsUppercase=loginpassword.value.search(uppercaseLetterPattern)>=0;
let passwordContainsDigit=loginpassword.value.search(digitPattern)>=0;
if(!emailNotNull)loginEmailError.textContent="Provide your email address for easier verification.";
if(emailNotNull&&!emailValid)loginEmailError.textContent="Ensure the provided email address is valid.";
if(!passwordNotNull)loginpasswordError.textContent="Enter your password to login into your account.";
if(passwordNotNull&&!passwordNotLessThanSixCharacters)loginpasswordError.textContent="Your password should not be less than 6 characters long.";
if(passwordNotNull&&!passwordNotGreaterThanTwelveCharacters)loginpasswordError.textContent="Your password should not be longer than 12 characters long.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsLowercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsLowercase)loginpasswordError.textContent="Your password should contain a lowercase letter.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsUppercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsUppercase)loginpasswordError.textContent="Your password should contain an uppercase letter.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsDigit||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsDigit)loginpasswordError.textContent="Your password should contain a digit.";
loginPasswordAvailable=registeredUsers.some((registeredUser)=>{
return registeredUser.clientPassword===loginpassword.value;
});
loginEmailAvailable=registeredUsers.some((registeredUser)=>{
return registeredUser.clientEmailaddress===loginEmail.value;
}); //Here, I'll set the submitted details object on the following basis, as long as the natural factors for both an email and a password to be submitted are present, then I'll assign property values to the email and password properties of the object, regardless of whether they exist in our system or not
if(emailNotNull&&emailValid&&passwordContainsDigit&&passwordContainsLowercase&&passwordContainsUppercase&&passwordNotGreaterThanTwelveCharacters&&passwordNotLessThanSixCharacters&&passwordNotNull){
submittedDetailsAccount.clientEmailaddress=loginEmail.value;
submittedDetailsAccount.clientPassword=loginpassword.value;
}
if(passwordNotNull&&passwordNotLessThanSixCharacters&&passwordNotGreaterThanTwelveCharacters&&passwordContainsLowercase&&passwordContainsUppercase&&passwordContainsDigit&&loginPasswordAvailable===false)loginpasswordError.textContent="Password not recognised.";
if(emailNotNull&&emailValid&&loginEmailAvailable===false)loginEmailError.textContent="Email not recognised.";   
if(emailNotNull&&emailValid&&loginEmailAvailable&&passwordContainsDigit&&passwordContainsLowercase&&passwordContainsUppercase&&passwordNotGreaterThanTwelveCharacters&&passwordNotLessThanSixCharacters&&passwordNotNull&&loginPasswordAvailable===false)alert(`Hi, your email address ${loginEmail.value} is recognised, however, the password ${loginpassword.value} does not seem to exist for this account.`);
if(passwordNotNull&&passwordContainsDigit&&passwordContainsLowercase&&passwordContainsUppercase&&passwordNotGreaterThanTwelveCharacters&&passwordNotLessThanSixCharacters&&loginPasswordAvailable&&emailNotNull&&emailValid&&!loginEmailAvailable){
  alert(`Hi there, the password you have submitted is recognised by our system, however, we can't seem to trace the email address you've provided.`);
  alert(`Kindly create an account to access our services.`);
  createSignUpForm();
}
clientAccountPresent=registeredUsers.some((certainUser)=>{
return certainUser.clientEmailaddress===submittedDetailsAccount.clientEmailaddress&&certainUser.clientPassword===submittedDetailsAccount.clientPassword;
});
if(passwordContainsDigit&&passwordContainsLowercase&&passwordContainsUppercase&&passwordNotGreaterThanTwelveCharacters&&passwordNotLessThanSixCharacters&&passwordNotNull&&loginPasswordAvailable===false&&emailNotNull&&emailValid&&loginEmailAvailable===false){
  alert(`Hi there, we couldn't recognise any of your login details,create an account to sign up.`);
  setTimeout(()=>{
    createSignUpForm();
  },800); 
}
if(clientAccountPresent)alert(`Great, all login details are correct, welcome.`);
})
movieSection.append(forgotPasswordButton);
forgotPasswordButton.addEventListener("click",(e)=>{
  forgotPasswordClickCount++;
  if(loginButtonClickCount<1)alert("At least attempt logging into the account for us to help you retrieve your password");
  if(loginButtonClickCount>=1&&loginEmailAvailable&&loginpassword.value===""||loginButtonClickCount>=1&&loginEmailAvailable&&loginpassword.value!==""&&loginpasswordError.textContent=="Password not recognised."){
    alert("Hi, we shall help you recover your account");
    passwordRecoveryForm();
  }
})
}
function setFinalSecurityQuestion(){
let uniqueAffectedUsers=Array.from(affectedClients.reduce((map,user)=>map.set(user.clientEmailaddress,user),new Map()).values());
return uniqueAffectedUsers;
}
function passwordRecoveryForm(){
  movieSection.innerHTML=`<form id="recoveryForm" novalidate>
  <label for="clientEmail">Enter Your Email Here:</label><br>
  <input type="email" id="clientEmail"/><br>
  <p id="clientEmailError"></p><br>
  <label for="securityQuestion">Who Is Your Favourite Musician?</label><br>
  <input id="securityQuestion" type="text"/><br>
  <p id="securityQuestionError"></p><br>
  <button type="submit" id="submitDetails">Submit</button>
  </form>`
  let clientEmail=document.querySelector("#clientEmail");
  let clientEmailError=document.querySelector("#clientEmailError");
  let securityQuestion=document.querySelector("#securityQuestion");
  let securityQuestionError=document.querySelector("#securityQuestionError");
  let submitDetails=document.querySelector("#submitDetails");
  let submitDetailsClickCount=0; //I want to establish how many times the submit button is clicked while a user submits a password reset request, it should only push the details of the affected user once to local storage, so as to avoid redundancy in the local storage
  submitDetails.addEventListener("click",(e)=>{
    e.preventDefault();
    submitDetailsClickCount++;
    clientEmailError.textContent="";
    securityQuestionError.textContent="";
    let clientEmailNotNull=clientEmail.value!=="";
    let clientEmailValid=clientEmail.validity.typeMismatch===false;
    let securityQuestionAnswered=securityQuestion.value!=="";
    if(clientEmailNotNull===false)clientEmailError.textContent=`Fill in your email so that we can assist you recover your password.`;
    if(clientEmailValid===false)clientEmailError.textContent=`Ensure your email address is in the correct format.`;
    if(securityQuestionAnswered===false)securityQuestionError.textContent=`Provide an answer to this question as it will be essential in the recovery of your account later on.`;
    if(clientEmailError.textContent==""&&securityQuestionError.textContent==""){
      alert(`Just a moment as we try to verify your email address.`);
      affectedUserInformation.clientEmailaddress=clientEmail.value;
      affectedUserInformation.clientSecurityQuestion=securityQuestion.value;
      clientAccountPresent=registeredUsers.some(registeredUser=>registeredUser.clientEmailaddress===affectedUserInformation.clientEmailaddress);
      if(clientAccountPresent&&submitDetailsClickCount===1){
        alert(`Hello there, we were able to trace an account with the email address ${clientEmail.value}`);
        alert(`We shall help you reset your password shortly.`);
        affectedClients.push(affectedUserInformation);
        affectedClients=setFinalSecurityQuestion();
        localStorage.setItem("affectedUser",JSON.stringify(affectedClients));
        verifyClientIdentity();
      }
      if(!clientAccountPresent){
        alert(`Hello there, sorry, we could not trace the account for the provided email address ${clientEmail.value}`);
        alert(`We recommend you create an account.`);
        setTimeout(()=>{
          createSignUpForm();
        },1000);
      }
    }
  }) 
}
let identifiedClient={};
let identificationQuestionPassed;
function verifyClientIdentity(){
  movieSection.innerHTML=`
  <h1>Hi,Fill In Your Details Below To Reset Your Password</h1>
  <form id="verificationForm" novalidate>
  <label for="mailAddress">Your Email Address:</label><br>
  <input type="email" id="mailAddress" name="mailAddress"><br>
  <p id="mailAddressError"></p>
  <label for="securityResponse">Whom Did You Pick As Your Favourite Musician?</label><br>
  <input type="text" name="securityResponse" id="securityResponse"/><br>
  <p id="responseError"></p>
  <button id="submitVerification" type="submit">Submit Data</button>
  </form>`
  let mailAddress=document.querySelector("#mailAddress");
  let mailAddressError=document.querySelector("#mailAddressError");
  let securityResponse=document.querySelector("#securityResponse");
  let responseError=document.querySelector("#responseError");
  let submitVerification=document.querySelector("#submitVerification");
  submitVerification.addEventListener("click",(e)=>{
    e.preventDefault();
    let mailAddressValid=mailAddress.validity.typeMismatch===false;
    mailAddressError.textContent="";
    responseError.textContent="";
    if(mailAddress.value=="")mailAddressError.textContent="You have to fill in your email to get assistance.";
    if(mailAddressValid===false)mailAddressError.textContent="Ensure the email address is in the correct format.";
    if(securityResponse.value=="")responseError.textContent="You may not be able to recover your account if this question is unanswered.";
    if(mailAddressError.textContent==""&&responseError.textContent==""){
      identifiedClient.email=mailAddress.value;
      identifiedClient.response=securityResponse.value;
      identificationQuestionPassed=affectedClients.some((client)=>client.clientEmailaddress==identifiedClient.email&&client.clientSecurityQuestion==identifiedClient.response);
      if(identificationQuestionPassed){
        alert(`Great, the details you provided are correct, you'll be presented with a new form to reset your password.`);
        resetPassword();
      }
    }
  })
};
function savefinalPassword(){//The essence of this function is to help in an instance where, once the user will have set a new password, the samer user doesn't keep appearing with different passwords at different indices of the registeredUsers array
let uniqueUsers=Array.from(registeredUsers.reduce((map,user)=> map.set(user.clientEmailaddress,user),new Map()).values());
return uniqueUsers;
}
function resetPassword(){
  movieSection.innerHTML=`<form id="passwordRecover" novalidate>
  <h1>Reset Your Password Here:</h1>
  <label for="useremail">Enter Your Email Here:</label><br>
  <input type="email" id="useremail" name="useremail"><br>
  <p id="useremailError"></p>
  <label for="newpassword">Enter Your New Password Here:</label><br>
  <input type="password" id="newpassword" name="newpassword"><br>
  <p id="newpasswordError"></p>
  <button id="savePassword" type="submit">Save Password</button>
  </form>`
  let useremail=document.querySelector("#useremail");
  let useremailError=document.querySelector("#useremailError");
  let newpassword=document.querySelector("#newpassword");
  let newpasswordError=document.querySelector("#newpasswordError");
  let savePassword=document.querySelector("#savePassword");
  savePassword.addEventListener("click",(e)=>{
    e.preventDefault();
    useremailError.textContent="";
    newpasswordError.textContent="";
    let mailAddressValid=useremail.validity.typeMismatch===false;
    let emailNotNull=useremail.value!=="";
    let passwordNotNull=newpassword.value!=="";
let passwordNotLessThanSixCharacters=newpassword.value.length<6===false;
let passwordNotGreaterThanTwelveCharacters=newpassword.value.length>12===false;
let passwordContainsLowercase=newpassword.value.search(lowercaseLetterPattern)>=0;
let passwordContainsUppercase=newpassword.value.search(uppercaseLetterPattern)>=0;
let passwordContainsDigit=newpassword.value.search(digitPattern)>=0;
if(!emailNotNull)useremailError.textContent="Provide your email address for easier verification.";
if(emailNotNull&&!mailAddressValid)useremailError.textContent="Ensure the provided email address is valid.";
if(!passwordNotNull)newpasswordError.textContent="You have to enter a new password to replace the lost one.";
if(passwordNotNull&&!passwordNotLessThanSixCharacters)newpasswordError.textContent="Your password should not be less than 6 characters long.";
if(passwordNotNull&&!passwordNotGreaterThanTwelveCharacters)newpasswordError.textContent="Your password should not be longer than 12 characters long.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsLowercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsLowercase)newpasswordError.textContent="Your password should contain a lowercase letter.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsUppercase||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsUppercase)newpasswordError.textContent="Your password should contain an uppercase letter.";
if(passwordNotNull&&passwordNotLessThanSixCharacters&&!passwordContainsDigit||passwordNotNull&&passwordNotGreaterThanTwelveCharacters&&!passwordContainsDigit)newpasswordError.textContent="Your password should contain a digit.";
 if(useremailError.textContent==""&&newpasswordError.textContent==""){
alert(`Great,saving your new password...`);
userAccount.clientPassword=newpassword.value;
userAccount.clientEmailaddress=useremail.value;
registeredUsers.push(userAccount);
registeredUsers=savefinalPassword();
localStorage.setItem("accountUsers",JSON.stringify(registeredUsers));
alert(`All good, your new password has been saved. You can head over to the login page in a few.`);
createLoginForm();
 }
})
}
let allIcons=document.querySelectorAll("i");
allIcons.forEach((icon)=>{
  icon.addEventListener("click",(e)=>{
    if(icon.id==="personIcon")createSignUpForm();
    if(icon.id==="houseIcon")movieSection.innerHTML=unalteredPage;
    if(icon.id==="cartIcon")movieSection.innerHTML=`
    <table id="moviesTable">
    <thead>
    <tr>
        <th>MOVIE NAME</th>
        <th>MOVIE IMAGE</th>
        <th>MOVIE PRICE (Ksh.)</th>
    </tr>
    </thead>
</table>`
  })
})
let addToCartButton=document.createElement("button");
addToCartButton.textContent="Add To Cart";
let movieData;
let allMovies=document.querySelectorAll(".movies");
allMovies.forEach((movie,movieIndex)=>{
    movie.addEventListener("click",()=>{
      if(movie.id==="inceptionFilm"){
        movieSection.innerHTML=`<div id="inceptionSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#inceptionSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#inceptionSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#inceptionSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#inceptionSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#inceptionSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="inception1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="inception2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="inception3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="inception4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="inception5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#inceptionSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#inceptionSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Domm Cobb (Leonardo DiCaprio) is a thief with a rare ability to enter people's dreams and steal their secrets from their subconcious. His skill has made him a hot corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he is offered a seemingly impossible task: Plant an idea in someone's mind. If he succeeds,it will be the perfect crime, but a dangerous enemy anticipates Cobb's every move.</p>
        </div> `
      };
      if(movie.id==="exMachinaFilm"){
        movieSection.innerHTML=`<div id="machinaSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#machinaSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#machinaSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#machinaSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#machinaSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#machinaSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="machina1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="machina2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="machina3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="machina4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="machina5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#machinaSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#machinaSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Caleb Smith (Domhnall Gleeson) a programmer at a hige internet company, wins a contest that enables him to spend a week at the private estate of Nathan.</p> 
         </div> `
      }; 
      if(movie.id==="arrivalFilm"){
        movieSection.innerHTML=`<div id="arrivalSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#arrivalSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#arrivalSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#arrivalSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#arrivalSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#arrivalSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="arrival.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="arrival2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="arrival3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="arrival4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="arrival5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#arrivalSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#arrivalSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";> Louise Banks's daughter Hannah, dies at the age of twelve from an incurable illness.
        Twelve extraterrestial spaccrafts hover over various locations around the earth. In the ensuing wide spread panic,affected nations send military and scientific experts to monitor and study them.</p>
                </div> `
      };  
      if(movie.id==="herFilm"){
        movieSection.innerHTML=`<div id="herSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#herSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#herSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#herSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#herSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#herSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="her1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="her2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="her3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="her4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="her5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#herSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#herSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)">A sensitive and soulful man earns a living by writing letters for other people. Left heart-broken after his marriage ends, Theodre(Joaquin Phoenix)  becomes fascinated with a new operating system,which reportedly develops into an intuitive and unique entity in its own right. He starts the program and meets Samantha (Scarlett Johansonn), whose voice reveals a playful and sensitive personality. Though "friends" initially, the relationship soon develops into love.</p>
        </div> `
      };
      if(movie.id==="matrixFilm"){
        movieSection.innerHTML=`<div id="matrixSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#matrixSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#matrixSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#matrixSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#matrixSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#matrixSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="matrix1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="matrix2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="matrix3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="matrix4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="matrix5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#matrixSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#matrixSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Neo (Keanu Reeves)believes that Morpheus(Laurence Fishburne),an elusive figure considered to be the most dangerous man alive, can answer his question--What is the matrix? Neo is contacted by Trinity (Carrie - Ann Moss), a beautiful stranger who leads him into an underworld where he meets Morpheus. They fight a brutal battle for their lives against a cadre of viviously intelligent secret agents. It is a teuth that could cost Neo something more precious than his life.               </p>
        </div> `
      };
       if(movie.id==="edgeOfTomorrowFilm"){
        movieSection.innerHTML=`<div id="edgeSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#edgeSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#edgeSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#edgeSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#edgeSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#edgeSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="edgeOfTomorrow.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="edge2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="edge3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="edge4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="edge5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#edgeSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#edgeSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>When earth falls under attack from invincible aliens, no military unit in the world is able to beat them.Maj William Cage (Tom Cruise), an officer who has never seen combat, is assigned to a suicide mission. Killed within moments, cage finds himself thrown into a time loop, in which he relives the same brutal fight--and his death--over and over again. However, Cage's fighting skills improve with each encore,bringing him and a comrade (Emily Blunt)ever closer to defeating the aliens.  </p>
        </div> `
      };
      if(movie.id==="wrathOfManFilm"){
        movieSection.innerHTML=`<div id="wrathSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#wrathSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#wrathSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#wrathSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#wrathSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#wrathSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="wrathOfMan.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="wrath2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="wrath3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="wrath4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="wrath5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#wrathSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#wrathSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Mysterious and wild eyed,a new security guard for a cash and truck surprises his coworkers when he unleashes his skills during a heist.They're left wondering who he is.</p>
        </div> `
      };
      if(movie.id==="operationFortuneFilm"){
        movieSection.innerHTML=`<div id="operationSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#operationSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#operationSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#operationSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#operationSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#operationSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="operation1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="operation2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="operation3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="operation4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="operation5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#operationSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#operationSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Elite spy Orson Fortune must track down and stop the sale of a deadly new weapons technology wielded by billionaire arms broker Greg Simmonds. Reluctantly teamed up with some of  the world's best operatives, Fortune and his team recruit Hollywood's biggest movie star, Danny Francesco, to help them improve on their gloe-trotting mission to save the world.</p>
        </div> `
      };
      if(movie.id==="falconRisingFilm"){
        movieSection.innerHTML=`<div id="falconSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#falconSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#falconSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#falconSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#falconSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#falconSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="falcon1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="falcon2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="falcon3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="falcon4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="falcon5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#falconSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#falconSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>A former Marine (Micheal Jai White) travels to Brazil to hunt down the brutal Japanese mobsters who attacked his siter and left her for dead.</p>
        </div> `
      };
       if(movie.id==="bloodAndBoneFilm"){
        movieSection.innerHTML=`<div id="bloodBoneSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#bloodBoneSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#bloodBoneSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#Slides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#bloodBoneSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#bloodBoneSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="blood1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="blood2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="blood3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="blood4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="blood5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#bloodBoneSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#bloodBoneSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Ex-con Isaiah Bone moves to Los Angeles after his release. His goal is to fulfill a promise to a dead friend by taking the local underground fighting world by storm. He defeats every opponent making thousands of dollars in the process.</p>
        </div> `
      };
       if(movie.id==="heartOfStoneFilm"){
        movieSection.innerHTML=`<div id="heartSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#heartSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#heartSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heartSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#heartSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#heartSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="heart1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="heart2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="heartOfStone.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="heart4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="heart5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#heartSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#heartSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Rachel Stone is an intelligence operative, the only woman that stands between  her powerful global peackeeping organization  and the loss of its most valuable -- and dangerous -- asset.</p>
        </div> `
      };
      if(movie.id==="damagedFilm"){
        movieSection.innerHTML=`<div id="damagedSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#damagedSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#damagedSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#damagedSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#damagedSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#damagedSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="damaged1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damaged2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damaged3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damaged4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damaged5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#damagedSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#damagedSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>When a sadistic murderer surfaces in Scotland, terrified local authorities call on a Chicago detective who investigated a killing spree  with the same horrific pattern five years earlier.</p>
        </div> `
      };
      if(movie.id==="hiddenStrikeFilm"){
        movieSection.innerHTML=`<div id="hiddenStrikeSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="hidden1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="hidden2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="hidden3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="hidden4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="hidden5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#hiddenStrikeSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Two former soldiers face non-stop danger as they travel along one of the most dangerous roads in the world.</p>
        </div> `
      };
      if(movie.id==="yearOneFilm"){
        movieSection.innerHTML=`<div id="yearOneSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#yearOneSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#yearOneSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#yearOneSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#yearOneSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#yearOneSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="year1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="yearOne.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="year3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="year4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="year5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#yearOneSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#yearOneSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>After Neanderthal hunter Zed (Jack Black) is exiled for eating the forbidden fruit, he and his sardonic buddy Oh (Micheal Cera) leave their village and begin an epic journey through history. The pals encounter biblical characters suchas cain (David Cross) and Abel, Abraham (Hank Azaria), and others, and wind up in Sodom. Along the way, Zed debunks common beliefs and replaces them with his own delusions of grandeur.</p>
        </div> `
      };
      if(movie.id==="theLostOneFilm"){
        movieSection.innerHTML=`<div id="lostOneSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#lostOneSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#lostOneSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#lostOneSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#lostOneSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#lostOneSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="lost1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lost2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lost3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lost4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lost5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#lostOneSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#lostOneSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Since 1865 , treasure hunters have searched, but little of that immense wealth has ever been found. Now, one hundred and sixty years later, two factions of what remains of the Knights of the golden circle want lost treasure-one to spend for their own ends, the other to preserve it.</p>
        </div> `
      };
      if(movie.id==="damselFilm"){
        movieSection.innerHTML=`<div id="damselSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#damselSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#damselSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#damselSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#damselSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#damselSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="damsel1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damsel2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damsel3.jpg" class="d-block w-100">
        </div> 
         <div class="carousel-item">
        <img src="damsel4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="damsel5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#damselSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#damselSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>A young woman agrees to marry a prince-only to discover it was all a trap. She is thrown into a cave with a fire breathing dragon and must rely on hr wits and will to survive.</p>
        </div> `
      };
      if(movie.id==="tripleFrontierFilm"){
        movieSection.innerHTML=`<div id="frontierSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#frontierSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#frontierSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#frontierSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#frontierSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#frontierSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="frontier1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="frontier2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="frontier3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="frontier4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="frontier5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#frontierSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#frontierSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Former Special Forces Operatives reunite to plan a heist in a sparsely populated multi border zone of South America. For the first time in their prestigious careers, these unsung heroes undertake their dangerous mission for themselves instead of their country. But when an unexpected  turn and threaten to spiral out of control, their skills, their loyalties, and their morals are pushed to a breaking point in an epic battle for survival.</p>
        </div> `
      };
      if(movie.id==="revenantFilm"){
        movieSection.innerHTML=`<div id="revenantSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#revenantSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#revenantSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#revenantSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#revenantSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#revenantSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="revenant1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="revenant2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="revenant3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="revenant7.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="revenant5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#revenantSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#revenantSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)">While exploring the wildnerness in 1823, frontiersman HUgh Glass (Leonardo Dicaprio)  sustains life threaatening injuries  from a brutal bear attack. When a member (Tom Hardy) of his hunting team kills his young son (Forrest Goodluck) and leaves him for dead, Glass must utilise his survival skills to find a way back to civilisation. Grief stricken and fueled by vengeace, the legendary fur trapper treks through the snowy terrain to track down the man who betrayed him.</p>
        </div> `
      };
      if(movie.id==="changeUpFilm"){
        movieSection.innerHTML=`<div id="changeUpSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#changeUpSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#changeUpSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#changeUpSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#changeUpSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#changeUpSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="changeUp1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="changeUp2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="changeUp3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="changeUp4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="theChangeUp.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#changeUpSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#changeUpSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>The film stars Ryan Reynolds and Jason Bateman as Mitch Planko and dave Lockwood, two best friends living in Atlanta who "switch bodies" after urinating...</p>
        </div> `
      };
      if(movie.id==="theOtherGuysFilm"){
        movieSection.innerHTML=`<div id="guysSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#guysSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#guysSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#guysSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#guysSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#guysSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="theGuys1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="theGuys2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="theGuys3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="theGuys4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="theOtherGuys.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#guysSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#guysSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>Unlike their heroic counterparts on the force,desk-bound NYPD  detectives Gamble (Will Ferrell) and Hoitz (Mark Wahlberg) garner no headlines as they work day to day. Gamble relishes his job as a paper pusher, but Hoitz is itching to get back on the street and make a name for himself. When a seemingly minor case turns out to be a big deal, the two cops finally get a chance to prove to their comrades that they have the right stuff. </p>
        </div> `
      };
      if(movie.id==="grownUpsFilm"){
        movieSection.innerHTML=`<div id="grownUpsSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#grownUpsSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#grownUpsSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#grownUpsSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#grownUpsSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#grownUpsSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="grownUps1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="grownUps2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="grownUps3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="grownUps4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="grownUps5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#grownUpsSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#grownUpsSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>A single man who drinks too much. A fatherwith three daughters who he rarely sees. A guy who is overweight and unemployed. A hen pecked househusband. a successful Hollywood agent married to a fashion designer . What do these five men have in common? They used to play for the  same basketball team at school. Now, their former coach has died, and they were reunited at his funeral. Will the group rediscover old bonds?</p>  </p>
        </div> `
      };
      if(movie.id==="familyAffairFilm"){
        movieSection.innerHTML=`<div id="familyAffairSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#familyAffairSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#familyAffairSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#familyAffairSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#familyAffairSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#familyAffairSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="family1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="family2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="family3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="family4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="family5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#familyAffairSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#familyAffairSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>A surprising romance kicks off comic consequences for a young woman, her mother and her movie star boss, as they face the complications of love, sex and identity.</p>
        </div> `
      };
      if(movie.id==="liftFilm"){
        movieSection.innerHTML=`<div id="liftSlides" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#liftSlides" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#liftSlides" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#liftSlides" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#liftSlides" data-bs-slide-to="3"></button>
        <button type="button" data-bs-target="#liftSlides" data-bs-slide-to="4"></button>
        </div>
        <div class="carousel-inner">
        <div class="carousel-item active">
        <img src="lift1.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lift2.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lift3.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lift4.jpg" class="d-block w-100">
        </div>
         <div class="carousel-item">
        <img src="lift5.jpg" class="d-block w-100">
        </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#liftSlides" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#liftSlides" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
        </button>
        </div>
        <div style="padding:15px";>
        <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
        <p style="color:rgb(255,255,255)";>A master thief is wooed by his ex-girlfriend and the FBI to pull off an impossible heist with his international crew on a 777 passenger  flight from London to Zurich.</p>
        </div> `
      }
       if(movie.id==="upgradedFilm"){
          movieSection.innerHTML=`<div id="upgradedSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#upgradedSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#upgradedSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#upgradedSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#upgradedSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#upgradedSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="upgraded10.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="upgraded2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="upgraded3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="upgraded4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="upgraded5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#upgradedSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#upgradedSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" style="color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)";>An aspiring art intern is invited on a last minute work trip to London, where she meets a handsome stranger.</p>
          </div> `
        };
        if(movie.id==="theWatchersFilm"){
          movieSection.innerHTML=`<div id="watchersSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#watchersSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#watchersSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#watchersSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#watchersSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#watchersSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="watchers1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="watchers2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="watchers3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="watchers4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="watchers5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#watchersSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#watchersSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)";>A 28-year-old artist gets stranded in an expansive, untouched forest in Western Ireland.Finding shelter, she unknowingly becomes trapped alongside three strangers who are stalked by mysterious creatures every night. </p>
          </div> `
        };
        if(movie.id==="quietPlaceFilm"){
          movieSection.innerHTML=`<div id="quietPlaceSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#quietPlaceSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#quietPlaceSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#quietPlaceSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#quietPlaceSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#quietPlaceSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="quietPlace1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="quietPlace2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="quietPlace3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="quietPlace4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="quietPlace5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#quietPlaceSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#quietPlaceSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)";>A Quiet Place is a 2018 American post-apocalyptic horror film directed by John Krasinki. The screenplay was written by Scott Beck and Bryan Woods from a story they concieved, with contributions by Krasinski after he joined the project. The plot revolves around a mother (Emily Blunt) and father (Krasinski) who struggle to survive and raise their children (Millicent Simmonds and Noah Jupe) in a post-apocalyptic world inhabited by blind extaterrestial creatures with an acute sense of hearing.
          </div> `
        };
        if(movie.id==="immaculateFilm"){
          movieSection.innerHTML=`<div id="immaculateSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#immaculateSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#immaculateSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#immaculateSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#immaculateSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#immaculateSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="immaculate1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="immaculate2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="immaculate.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="immaculate4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="immaculate5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#immaculateSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#immaculateSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)";>An American nun embarks on a new journey when she joins a remote convent in the Italian countryside. However, her warm welcome quickly turns into a nightmare when she discovers her new home harbours a sinister secret and unspeakable horrors.</p>
          </div> `
        };
        if(movie.id==="arcadianFilm"){
          movieSection.innerHTML=`<div id="arcadianSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#arcadianSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#arcadianSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#arcadianSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#arcadianSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#arcadianSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="arcadian1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="arcadian2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="arcadian3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="arcadian4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="arcadian5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#arcadianSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#arcadianSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)";>In the near future on a decimated earth, Paul and his twin sons face a terror at night when  ferocious creatures awaken. When Paul is nearly killed , the boys come up with a plan for survival, using everything their father taught them to keep him alive.</p>
          </div> `
        };
        if(movie.id==="stingFilm"){
          movieSection.innerHTML=`<div id="stingSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#stingSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#stingSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#stingSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#stingSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#stingSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="sting1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="sting2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="sting3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="sting4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="sting5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#stingSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#stingSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)">Charlotte is a rebelious 12 year old girlwho finds a spider in her rundown apartment building. She keeps it in a jar, but it soon starts to grow at a monstrous rate and develops an insatiable appetite for blood. As her neighbors begin to disappear, Charlotte and her family find themselves in a desparate fight for their lives against a ravenous arachnid with a taste for human flesh. </p>
          </div> `
        };
        if(movie.id==="abigailFilm"){
          movieSection.innerHTML=`<div id="abigailSlides" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
          <button type="button" data-bs-target="#abigailSlides" data-bs-slide-to="0" class="active"></button>
          <button type="button" data-bs-target="#abigailSlides" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#abigailSlides" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#abigailSlides" data-bs-slide-to="3"></button>
          <button type="button" data-bs-target="#abigailSlides" data-bs-slide-to="4"></button>
          </div>
          <div class="carousel-inner">
          <div class="carousel-item active">
          <img src="abigail1.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="abigail2.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="abigail3.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="abigail4.jpg" class="d-block w-100">
          </div>
           <div class="carousel-item">
          <img src="abigail5.jpg" class="d-block w-100">
          </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#abigailSlides" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#abigailSlides" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
          </button>
          </div>
          <div style="padding:15px";>
          <h1 style="font-size:23px" "color:orangered";>Movie Description</h1>
          <p style="color:rgb(255,255,255)">A group of would be criminals kidnaps the daughter of a powerful underworld figure. Holding her for ransom in an isolated mansion, their plan starts to unravel when they discover their young captive is actually a bloodthirsty vampire. </p>
          </div> `
        };
        movieSection.append(addToCartButton);
        addToCartButton.addEventListener("click",(e)=>{
         // alert(`The movie ${movie.id} at index ${movieIndex} has been selected.`);
         userAccountConfirmation=prompt("Hi there, before adding a movie to the cart confirm if you have a registered account to do so, answer yes or no in the space below.");
         if(userAccountConfirmation=="yes"||userAccountConfirmation=="yeah"||userAccountConfirmation=="yea"||userAccountConfirmation=="Yes"||userAccountConfirmation=="Yeah"||userAccountConfirmation=="Yea"){
          alert("Great, now just provide your login details.");
          createLoginForm();
        }
          else {
          alert("Kindly create an account in order to be able to add products to your cart.");
          createSignUpForm();
         }
        });
        movieData=movieSection.innerHTML;
      history.pushState(movieData,"","");
      });
  });
    let searchArea=document.querySelector("#searchArea");
    let availableMovies=[/inception/i,/ex machina/i,/ex-machina/i,/arrival/i,/her/i,/the matrix/i,/edge of tomorrow/i,/wrath of man/i,/operation fortune/i,/falcon rising/i,/blood and bone/i,/heart of stone/i,/damaged/i,/hidden strike/i,/year one/i,/the lost one/i,/damsel/i,/triple frontier/i,/the revenant/i,/revenant/i,/the change up/i,/the other guys/i,/grown ups/i,/a family affair/i,/family affair/i,/lift/i,/upgraded/i,/the watchers/i,/a quiet place/i,/quiet place/i,/immaculate/i,/arcadian/i,/sting/i,/abigail/i];
    let movieSearchResult; 
    searchArea.addEventListener("search",(e)=>{
      if(searchArea.value=="")alert("You cannot search for a blank category.");
      movieSearchResult=availableMovies.some(availableMovie=>availableMovie.test(searchArea.value));
      if(!movieSearchResult&&searchArea.value!=="")alert(`Sorry the movie ${searchArea.value} is currently unavailable`);
    })
    window.addEventListener("popstate",(e)=>{
    updatePageUI();
    let path=window.location.pathname;
    });
console.log(registeredUsers);
console.log(affectedClients);
