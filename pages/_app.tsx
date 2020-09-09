import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import { CloudinaryContext } from 'cloudinary-react';
import firebase from 'firebase';
import { ToastProvider } from 'react-toast-notifications';
import NavBar from '../components/nav-bar';

const firebaseConfig = {
    apiKey: 'AIzaSyA1AeYQBOthvnL5BAYS6K0HsHuDj1Dnw2w',
    authDomain: 'zen-resume.firebaseapp.com',
    databaseURL: 'https://zen-resume.firebaseio.com',
    projectId: 'zen-resume',
    storageBucket: 'zen-resume.appspot.com',
    messagingSenderId: '442998859119',
    appId: '1:442998859119:web:197f2c3e22b7b137c4b49a',
    measurementId: 'G-65314KF8CX',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

function MyApp({ Component, pageProps }) {
    return (
        <ToastProvider autoDismiss={true}>
            <CloudinaryContext cloudName="dtmkcgalp">
                <NavBar />
                <Component {...pageProps} />
            </CloudinaryContext>
        </ToastProvider>
    );
}

export default MyApp;
