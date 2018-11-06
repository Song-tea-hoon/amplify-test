import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';

import awsconfig from './aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
// Analytics.configure(awsconfig);

// const AnalyticsResult = document.getElementById('AnalyticsResult');
// const AnalyticsEventButton = document.getElementById('AnalyticsEventButton');
// let EventsSent = 0;
// AnalyticsEventButton.addEventListener('click', (evt) => {
//     Analytics.record('AWS Amplify Tutorial Event')
//         .then( (evt) => {
//             const url = 'https://console.aws.amazon.com/pinpoint/home/?region=us-east-1#/apps/'+awsconfig.aws_mobile_analytics_app_id+'/analytics/events';
//             AnalyticsResult.innerHTML = '<p>Event Submitted.</p>';
//             AnalyticsResult.innerHTML += '<p>Events sent: '+(++EventsSent)+'</p>';
//             AnalyticsResult.innerHTML += '<a href="'+url+'" target="_blank">View Events on the Amazon Pinpoint Console</a>';
//         });
// });

const AuthResult = document.getElementById('AuthResult');

// 가입 - 이메일 확인 전
const signupButton = document.getElementById('SignupButton');
signupButton.addEventListener('click', function(event){
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    console.log('Sign up - username : ' , username, ' password', password);
    Auth.signUp({
        username : username,
        password : password,
        attributes: {
            email: username,          // optional
            // phone_number,   // optional - E.164 number convention
            // other custom attributes 
        },
        // validationData: []  //optional
        })
        .then(data => {
            console.log('Success : ', data);
            const confirmForm = document.querySelector('.confirm');
            confirmForm.style.display = 'block';
            authStatus("Sign in Success Please check your e-mail and confrim [ " + data.user.username + " ]");
        })
        .catch(err => {
            console.log('Error : ' , err)
            authStatus("Sign up Error : " + err.message)
        })
});

// 가입 - 이메일 확인코드
const confirmSignupButton = document.getElementById('ConfirmSigninButton');
confirmSignupButton.addEventListener('click', function(event){
    const username = document.getElementById('username').value.trim();
    const code = document.getElementById('confirmcode').value.trim();
    // After retrieveing the confirmation code from the user
    Auth.confirmSignUp(username, code, {
        // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        forceAliasCreation: true    
    }).then(data => {
        console.log('Success : ', data);
        authStatus('Confirm success please login')
        const signinUsername = document.getElementById('signinusername')
        signinUsername.value = username;
    })
    .catch(err => {
        console.log('Error : ', err)
        authStatus("confirm Error : " + err.message)
    });
});

// login
const signinButton = document.getElementById('SigninButton');
const signin = document.querySelector('.signin');
signinButton.addEventListener('click', function(event){
    const username = document.getElementById('signinusername').value;
    const password = document.getElementById('signinpassword').value;

    Auth.signIn(username, password)
        .then(user => {
            console.log("Sign in ", user)
            checkAuth();
        })
        .catch(err => {
            console.log("Sign in Error : ", err)
            authStatus("Sign in Error : " + err.message)
        });
});

// sign out
const signoutButton = document.getElementById('SignoutButton');
const signout = document.querySelector('.signout');
signoutButton.addEventListener('click', function(event){
    Auth.signOut()
        .then(data => {
            console.log("sign out ", data)
            checkAuth();
        })
        .catch(err => {
            console.log("sign out Error", err)
            authStatus("sign out Error" + err);
        });
});

// 페이지 로드 시 유저 체크
window.addEventListener('load', function(event){
    this.console.log('window load complete');
    checkAuth();
})

function checkAuth(){
    //현제 인증된 사용자
    Auth.currentAuthenticatedUser()
        .then(user => {
            console.log(user)
            authStatus("Signed in as [ " + user.username + " ]");
            signout.style.display = 'block';
            signin.style.display = 'none';
        })
        .catch(err => {
            console.log(err)
            authStatus(err)
            signout.style.display = 'none';
            signin.style.display = 'block';
        });
}

function authStatus(str){
    // AuthResult.innerHTML = "<p>Auth Result</p>";
    AuthResult.innerHTML = "<p>" + str +"</p>"
}
