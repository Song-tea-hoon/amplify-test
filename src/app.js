import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';

import awsconfig from './aws-exports';

// retrieve temporary AWS credentials and sign requests
Auth.configure(awsconfig);
// send analytics events to Amazon Pinpoint
Analytics.configure(awsconfig);

const AnalyticsResult = document.getElementById('AnalyticsResult');
const AnalyticsEventButton = document.getElementById('AnalyticsEventButton');
let EventsSent = 0;
AnalyticsEventButton.addEventListener('click', (evt) => {
    Analytics.record('AWS Amplify Tutorial Event')
        .then( (evt) => {
            const url = 'https://console.aws.amazon.com/pinpoint/home/?region=us-east-1#/apps/'+awsconfig.aws_mobile_analytics_app_id+'/analytics/events';
            AnalyticsResult.innerHTML = '<p>Event Submitted.</p>';
            AnalyticsResult.innerHTML += '<p>Events sent: '+(++EventsSent)+'</p>';
            AnalyticsResult.innerHTML += '<a href="'+url+'" target="_blank">View Events on the Amazon Pinpoint Console</a>';
        });
});

const signinButton = document.getElementById('SigninButton');
signinButton.addEventListener('click', function(event){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('username : ' , username, ' password', password);
    Auth.signUp({
        username : username,
        password : password,
        attributes: {
            email: username,          // optional
            //phone_number,   // optional - E.164 number convention
            // other custom attributes 
        },
        //validationData: []  //optional
        })
        .then(data => console.log(data))
        .catch(err => console.log('Error : ',err));
});