import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import { CloudinaryContext } from 'cloudinary-react';

function MyApp({ Component, pageProps }) {
    return (
        <CloudinaryContext cloudName="dtmkcgalp">
            <Component {...pageProps} />
        </CloudinaryContext>
    );
}

export default MyApp;
