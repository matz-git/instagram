import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// here i want to import the seed file
// import {seedDatabase} from '../seed';

const config = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// here is where i want to call the seed file ONLY ONCE!
// seedDatabase(firebase);

export {firebase,FieldValue};
