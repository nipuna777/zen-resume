import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth'
import { useToasts } from 'react-toast-notifications';
import { useRouter } from 'next/router';

const useFirebaseAuthentication = () => {
    const [authUser, setAuthUser] = useState(null);
    const { addToast } = useToasts();
    const router = useRouter();

    useEffect(() => {
        const unlisten = firebase.auth().onAuthStateChanged((authUser) => {
            authUser ? setAuthUser(authUser) : setAuthUser(null);
        });
        return () => {
            unlisten();
        };
    });

    const logout = () => {
        firebase
            .auth()
            .signOut()
            .then(
                function () {
                    addToast('Logout succesful', { appearance: 'success' });
                },
                function (error) {
                    addToast(error, { appearance: 'error' });
                }
            )
            .finally(() => {
                router.push('/login');
            });
    };

    return { logout, authUser };
};

export default useFirebaseAuthentication;
