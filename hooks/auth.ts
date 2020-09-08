import { useState, useEffect } from 'react';
import firebase from 'firebase';

const useFirebaseAuthentication = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const unlisten = firebase.auth().onAuthStateChanged(
            authUser => {
                authUser
                    ? setAuthUser(authUser)
                    : setAuthUser(null);
            },
        );
        return () => {
            unlisten();
        }
    });

    return authUser
}

export default useFirebaseAuthentication