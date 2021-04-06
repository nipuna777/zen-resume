import { useForm, useFieldArray } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react';
import LoadingSVG from '../public/images/loading.svg';
import useFirebaseAuthentication from '../hooks/auth';
import 'firebase/firestore';
import ResumePreview from '../components/resume-viewer/resume-preview';
import sampleResume from './sample-resume.json';

import defaultTheme from '../styles/resume-default.module.css';
import '@reach/listbox/styles.css';
import { ResumeEditor } from '../components/resume-editor/resume-editor';
import firebase from 'firebase';

const placeHolderImageId = 'placeholder-profile_ubymfr';

export default function Resume() {
    const db = firebase.firestore();

    // TODO: better defaults (preferabally as a fallback json)
    const { control, register, watch, setValue } = useForm<any>({
        defaultValues: {
            name: 'Foo Bar',
            telephone: '+12345678',
            email: 'foo.bar@email.com',
            address: '',
            imageId: placeHolderImageId,
            value: '',
            about: {
                title: 'Objectives',
            },
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useState(defaultTheme);

    const documentRef = useRef(null);

    const fetchResume = async (authUser) => {
        setIsLoading(true);
        const resumeDocPath = db.collection('resumes').doc(authUser.uid);

        try {
            // TODO: replace with local storage or firebse
            //const resume = await (await resumeDocPath.get()).data();
            const resume = sampleResume;
            if (!resume) return;

            Object.keys(resume).forEach((key) => {
                setValue(key, resume[key]);
            });
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const { authUser } = useFirebaseAuthentication();
    useEffect(() => {
        // TODO: fetch locally if the user has not logged in
        if (authUser && authUser.uid) {
            fetchResume(authUser);
        }
    }, [authUser]);

    const fieldValues = watch();
    const {
        name,
        title,
        telephone,
        email,
        address,
        imageId,
        sections,
        bioSections,
        aboutTitle,
        aboutContent,
    } = fieldValues;
    return (
        <div className="flex flex-row flex-grow overflow overflow-hidden">
            {isLoading && (
                <div className="flex absolute top-0 left-0 bg-gray-500 bg-opacity-25 h-screen w-screen">
                    <LoadingSVG />
                </div>
            )}

            <ResumeEditor
                fieldValues={fieldValues}
                authUser={authUser}
                setIsLoading={setIsLoading}
                control={control}
                register={register}
                imageId={imageId}
                documentRef={documentRef}
                setValue={setValue}
                setStyles={setStyles}
            />

            {!isLoading && (
                <ResumePreview
                    documentRef={documentRef}
                    name={name}
                    title={title}
                    email={email}
                    address={address}
                    telephone={telephone}
                    sections={sections}
                    bioSections={bioSections}
                    imageId={imageId}
                    styles={styles}
                    aboutTitle={aboutTitle}
                    aboutContent={aboutContent}
                />
            )}
        </div>
    );
}
