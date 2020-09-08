import styles from '../styles/Resume.module.css';
import { useForm, Controller } from 'react-hook-form';
import TextInput from '../components/text-input';
import TextAreaInput from '../components/text-area-input';
import { Image, Transformation } from 'cloudinary-react';
import { useState, useEffect } from 'react';
import LoadingSVG from '../public/images/loading.svg';
import useFirebaseAuthentication from '../hooks/auth';
import firebase from 'firebase';
import { useToasts } from 'react-toast-notifications';

let ReactQuill;
if (typeof window !== 'undefined') {
    ReactQuill = require('react-quill');
}

export async function getStaticProps(context) {
    return {
        props: {
            title: 'Nipuna Gunathilake',
        },
    };
}

const db = firebase.firestore();

export default function Resume() {
    const { addToast } = useToasts();
    const { control, register, watch, setValue } = useForm<any>({
        defaultValues: {
            title: 'Nipuna Gunathilake',
            telephone: '+65123456789',
            email: 'nipuna777@gmail.com',
            address: 'Ruwan\nPittiyegedara',
            imageId: 'placeholder-profile_ubymfr',
            value:
                'To excel as a professional, in the fields of Accountancy and financial management while delivering best service possible in achieving organizational objectives.',
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const sections = [0, 1];

    const fieldValues = watch();

    const user = useFirebaseAuthentication();
    useEffect(() => {
        setIsLoading(false);

        if (user && user.uid) {
            db.collection('resumes')
                .doc(user.uid)
                .get()
                .then((doc) => {
                    const resume = doc.data();
                    Object.keys(resume).forEach((key) => {
                        setValue(key, resume[key]);
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user]);

    const { title, telephone, email, address, imageId } = fieldValues;
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            {isLoading && (
                <div className="flex absolute bottom-0 left-0 bg-gray-500 bg-opacity-25 w-screen h-screen">
                    <LoadingSVG />
                </div>
            )}
            <form className="p-5 h-screen overflow-y-auto overflow-x-hidden bg-gray-200 bg-opacity-25">
                <h1 className="text-2xl">Zen Resume</h1>
                <p className="text-xs">Edit your resume by changing settings below</p>
                <hr className="mb-5 mt-5" />

                <TextInput label="Title" inputRef={register} name="title" />

                <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Image (Maximum 10mb)</label>
                    <input
                        type="file"
                        name="profile-image"
                        accept="image/*"
                        onChange={(event) => {
                            let selectedFile = event.target.files[0];
                            const mbFileSize = event.target.files[0].size / (1024 * 1024);
                            if (mbFileSize > 10) {
                                alert('Image size too large. Must be no larger than 10MB');
                                return;
                            }

                            var data = new FormData();
                            data.append('file', selectedFile);
                            data.append('upload_preset', 'smkrczl7');

                            setIsLoading(true);
                            fetch('https://api.cloudinary.com/v1_1/dtmkcgalp/upload', {
                                method: 'POST',
                                body: data,
                            })
                                .then((res) => res.json())
                                .then((res) => {
                                    if (res.error) {
                                        console.error(res.error);
                                        const message = res.error.message || 'Error uploading image';
                                        addToast(message, { appearance: 'error' });
                                    } else {
                                        console.log(res.public_id);
                                        setValue('imageId', res.public_id);
                                        addToast('Uploaded image succesfully', { appearance: 'success' });
                                    }
                                })
                                .catch((error) => {
                                    console.error(error);
                                    const message = error.message || 'Error uploading image';
                                    addToast(message, { appearance: 'error' });
                                })
                                .finally(() => {
                                    setIsLoading(false);
                                });
                        }}
                    />
                </div>

                <TextInput label="Image ID" inputRef={register} name="imageId" hidden />

                <TextInput label="Email" inputRef={register} name="email" />
                <TextInput label="Telephone" inputRef={register} name="telephone" />
                <TextAreaInput label="Address" inputRef={register} name="address" />

                {sections.map((section, i) => {
                    return (
                        <div className="mb-4 mt-4">
                            <TextInput label={`Section ${i} title`} inputRef={register} name={`sectionTitle${i}`} />
                            {ReactQuill ? (
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Section {i}
                                    <Controller
                                        as={ReactQuill}
                                        name={`sectionValue${i}`}
                                        control={control}
                                        defaultValue=""
                                    />
                                </label>
                            ) : null}
                        </div>
                    );
                })}
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={(event) => {
                        event.preventDefault();
                        setIsLoading(true);

                        db.collection('resumes')
                            .doc(user.uid)
                            .set({ ...fieldValues })
                            .then(() => {
                                addToast('Saved changes successfully', { appearance: 'success' });
                            })
                            .catch(() => {
                                addToast('Error saving changes', { appearance: 'error' });
                            })
                            .finally(() => {
                                setIsLoading(false);
                            });
                    }}
                >
                    Save
                </button>
            </form>
            <div className="flex flex-col w-full p-8 border-l-2 border-gray-300">
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    <div className={styles.headerContent}>
                        <div className={styles.headerContentDesc}>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{address}</p>
                            <strong>{telephone}</strong>
                            <br />
                            <a className={styles.email} href={`mailto: ${email}`}>
                                {email}
                            </a>
                        </div>
                        <Image className={styles.headerContentImage} publicId={imageId}>
                            <Transformation width="200" height="200" gravity="faces" crop="fill" />
                        </Image>
                    </div>
                </header>
                {sections.map((section, i) => {
                    return (
                        <section className={styles.section}>
                            <div className={styles.sectionSide}>{fieldValues[`sectionTitle${i}`]}</div>
                            <div
                                className={styles.sectionContent}
                                dangerouslySetInnerHTML={{ __html: fieldValues[`sectionValue${i}`] }}
                            />
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
