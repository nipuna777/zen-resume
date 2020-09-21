import styles from '../styles/Resume.module.css';
import { useForm, useFieldArray } from 'react-hook-form';
import TextInput from '../components/text-input';
import TextAreaInput from '../components/text-area-input';
import { Image, Transformation } from 'cloudinary-react';
import { useState, useEffect, useRef } from 'react';
import LoadingSVG from '../public/images/loading.svg';
import useFirebaseAuthentication from '../hooks/auth';
import firebase from 'firebase';
import { useToasts } from 'react-toast-notifications';
import SectionEditor from '../components/section';
import { useReactToPrint } from 'react-to-print';

const placeHolderImageId = 'placeholder-profile_ubymfr';

const db = firebase.firestore();

export default function Resume() {
    const { addToast } = useToasts();
    const { control, register, watch, setValue } = useForm<any>({
        defaultValues: {
            title: 'Foo Bar (Software Engineer)',
            telephone: '+12345678',
            email: 'foo.bar@email.com',
            address: '',
            imageId: placeHolderImageId,
            value: '',
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sections',
    });
    const uploadRef = useRef(null);
    const documentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => documentRef.current,
    });

    const fieldValues = watch();

    const fetchResume = async (authUser) => {
        setIsLoading(true);
        const resumeDocPath = db.collection('resumes').doc(authUser.uid);

        try {
            const resume = await (await resumeDocPath.get()).data();
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
        if (authUser && authUser.uid) {
            fetchResume(authUser);
        }
    }, [authUser]);

    const { title, telephone, email, address, imageId, sections } = fieldValues;
    return (
        <div className="flex flex-row flex-grow overflow overflow-hidden">
            {isLoading && (
                <div className="flex absolute top-0 left-0 bg-gray-500 bg-opacity-25 h-screen w-screen">
                    <LoadingSVG />
                </div>
            )}
            <form className=" flex-col overflow-y-auto overflow-x-hidden bg-gray-200 bg-opacity-25">
                <div className="flex flex-row p-5 sticky top-0 left-0 bg-gray-300 z-10">
                    <button
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded flex-1"
                        onClick={(event) => {
                            event.preventDefault();
                            setIsLoading(true);

                            db.collection('resumes')
                                .doc(authUser.uid)
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
                    <button
                        className="bg-transparent hover:bg-gray-500 text-gray-700 font-semibold hover:text-white py-2 px-4 ml-2 border border-gray-500 hover:border-transparent rounded"
                        onClick={(event) => {
                            event.preventDefault();
                            handlePrint();
                        }}
                    >
                        Print
                    </button>
                </div>

                <div className="p-5">
                    <TextInput label="Title" inputRef={register} name="title" />

                    <div className="mb-5">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Select Image (Maximum 10mb)
                        </label>
                        <div className={imageId !== placeHolderImageId && 'hidden'}>
                            <input
                                type="file"
                                name="profile-image"
                                accept="image/*"
                                ref={uploadRef}
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

                        <div
                            className={`flex flex-row align-middle justify-between items-center ${
                                imageId === placeHolderImageId && 'hidden'
                            }`}
                        >
                            <Image className="w-16" publicId={imageId}>
                                <Transformation width="200" height="200" gravity="faces" crop="fill" />
                            </Image>
                            <button
                                className="bg-transparent hover:bg-red-300 text-red-400 text-sm hover:text-white p-1 mb-3 border border-red-300 hover:border-transparent rounded"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setValue('imageId', placeHolderImageId);
                                    uploadRef.current.click();
                                }}
                            >
                                Change image
                            </button>
                        </div>
                    </div>

                    <TextInput label="Image ID" inputRef={register} name="imageId" hidden />

                    <TextInput label="Email" inputRef={register} name="email" />
                    <TextInput label="Telephone" inputRef={register} name="telephone" />
                    <TextAreaInput label="Address" inputRef={register} name="address" />

                    {fields.map((section, index) => (
                        <div key={section.id}>
                            <SectionEditor index={index} section={section} register={register} control={control} />
                            <button
                                className="bg-transparent hover:bg-red-300 text-red-400 text-sm hover:text-white p-1 mb-3 border border-red-300 hover:border-transparent rounded"
                                onClick={(e) => {
                                    e.preventDefault();
                                    remove(index);
                                }}
                            >
                                Remove Section
                            </button>
                        </div>
                    ))}

                    <div>
                        <button
                            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            onClick={(e) => {
                                e.preventDefault();
                                append({
                                    title: 'Section Title',
                                    content: 'Add Content',
                                });
                            }}
                        >
                            + Add Section
                        </button>
                    </div>
                </div>
            </form>
            {!isLoading && (
                <div className="flex flex-col w-full  border-l-2 border-gray-400 bg-gray-300">
                    <div className="bg-white p-8 m-6 self-center" style={{ width: '210mm' }} ref={documentRef}>
                        <header className={styles.header}>
                            <h1 className={styles.headerTitle}>{title}</h1>
                            <div className={styles.headerContent}>
                                <div className={styles.headerContentDesc}>
                                    <a className={styles.email} href={`mailto: ${email}`}>
                                        {email}
                                    </a>
                                    <br />
                                    <strong>{telephone}</strong>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{address}</p>
                                </div>
                                <Image className={styles.headerContentImage} publicId={imageId}>
                                    <Transformation width="200" height="200" gravity="faces" crop="fill" />
                                </Image>
                            </div>
                        </header>
                        {sections?.map((section, index) => {
                            return (
                                <section key={`section.id-${index}`} className={styles.section}>
                                    <div className={styles.sectionSide}>
                                        <p>{section.title}</p>
                                        <p>{section.subtitle}</p>
                                    </div>
                                    <div
                                        className={styles.sectionContent}
                                        dangerouslySetInnerHTML={{ __html: section.content }}
                                    />
                                </section>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
