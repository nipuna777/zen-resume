import { useForm, useFieldArray } from 'react-hook-form';
import TextInput from '../components/text-input';
import TextAreaInput from '../components/text-area-input';
import { Image, Transformation } from 'cloudinary-react';
import { useState, useEffect, useRef } from 'react';
import LoadingSVG from '../public/images/loading.svg';
import useFirebaseAuthentication from '../hooks/auth';
import firebase from 'firebase';
import { useToasts } from 'react-toast-notifications';
import SectionEditor from '../components/section-editor';
import SimpleSectionEditor from '../components/simple-section-editor';
import { useReactToPrint } from 'react-to-print';
import Button from '../components/button';
import { HiXCircle } from 'react-icons/hi';
import QuillControl from '../components/quill-control';
import ResumePreview from '../components/resume-preview';

// TODO: lazy load the css
import defaultTheme from '../styles/resume-default.module.css';
import simpleTheme from '../styles/resume-simple.module.css';

const placeHolderImageId = 'placeholder-profile_ubymfr';

const db = firebase.firestore();

const themeMap = {
    default: defaultTheme,
    simple: simpleTheme,
};

export default function Resume() {
    const { control, register, watch, setValue } = useForm<any>({
        defaultValues: {
            name: 'Foo Bar',
            title: 'Software Engineer',
            telephone: '+12345678',
            email: 'foo.bar@email.com',
            address: '',
            imageId: placeHolderImageId,
            value: '',
        },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [styles, setStyles] = useState(defaultTheme);

    const documentRef = useRef(null);
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

    const { name, title, telephone, email, address, imageId, sections, bioSections, skills } = fieldValues;
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
                    skills={skills}
                    styles={styles}
                />
            )}
        </div>
    );
}

function BioSectionEditor({ register, control }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'bioSections',
    });

    return (
        <div>
            {fields.map((bioSection, index) => (
                <div key={bioSection.id} className="flex flex-row">
                    <TextInput
                        className="w-24"
                        label="Title"
                        inputRef={register}
                        name={`bioSections[${index}].title`}
                        defaultValue={bioSection.title}
                    />
                    <TextInput
                        className="ml-1 flex-grow "
                        label="Label"
                        inputRef={register}
                        name={`bioSections[${index}].label`}
                        defaultValue={bioSection.label}
                    />
                    <HiXCircle
                        className="self-center text-gray-500 hover:text-red-500 cursor-pointer mb-3 ml-2"
                        size={32}
                        onClick={() => remove(index)}
                    />
                </div>
            ))}

            <Button
                size="sm"
                onClick={() => {
                    append({
                        title: 'Bio section title',
                        content: 'Bio section label',
                    });
                }}
            >
                + Add bio item
            </Button>
        </div>
    );
}

function ResumeEditor({
    documentRef,
    setIsLoading,
    control,
    register,
    authUser,
    fieldValues,
    imageId,
    setValue,
    setStyles,
}) {
    const { addToast } = useToasts();
    const sectionFieldArray = useFieldArray({
        control,
        name: 'sections',
    });
    const skillsFieldArray = useFieldArray({
        control,
        name: 'skills',
    });
    const uploadRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => documentRef.current,
    });

    return (
        <form className=" flex-col overflow-y-auto overflow-x-hidden bg-gray-200 bg-opacity-25">
            <div className="flex flex-row p-5 sticky top-0 left-0 bg-gray-300 z-10">
                <Button
                    className="flex-1 mr-2"
                    onClick={() => {
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
                </Button>

                <Button onClick={handlePrint} color="secondary">
                    Print
                </Button>
            </div>

            <ThemeSelector setStyles={setStyles} />

            <div className="p-5">
                <TextInput label="Name" inputRef={register} name="name" />
                <TextInput label="Title" inputRef={register} name="title" />

                <BioSectionEditor register={register} control={control} />

                <ImageUpload
                    imageId={imageId}
                    uploadRef={uploadRef}
                    setIsLoading={setIsLoading}
                    addToast={addToast}
                    setValue={setValue}
                />

                <TextInput label="Image ID" inputRef={register} name="imageId" hidden />

                <TextInput label="Email" inputRef={register} name="email" />
                <TextInput label="Telephone" inputRef={register} name="telephone" />
                <TextAreaInput label="Address" inputRef={register} name="address" />

                <h2>Skills</h2>
                {skillsFieldArray.fields.map((skill, index) => (
                    <div key={skill.id} className="flex flex-row">
                        <QuillControl
                            className="flex-1 mb-3 mr-3"
                            control={control}
                            name={`skills[${index}].content`}
                            defaultValue={skill.content}
                        />
                        <HiXCircle
                            className="self-center text-gray-500 hover:text-red-500 text-h cursor-pointer mb-3"
                            size={32}
                            onClick={() => skillsFieldArray.remove(index)}
                        />
                    </div>
                ))}
                <Button
                    onClick={() => {
                        skillsFieldArray.append({
                            content: '',
                        });
                    }}
                    size="sm"
                >
                    + Add
                </Button>

                <Section type="Education" sectionFieldArray={sectionFieldArray} register={register} control={control} />

                <Section
                    controlType="simple"
                    type="Achievements"
                    sectionFieldArray={sectionFieldArray}
                    register={register}
                    control={control}
                />

                <Section
                    type="Work Experience"
                    sectionFieldArray={sectionFieldArray}
                    register={register}
                    control={control}
                />
            </div>
        </form>
    );
}

function Section({
    type,
    sectionFieldArray,
    register,
    control,
    controlType,
}: {
    type: string;
    sectionFieldArray: any;
    register: any;
    control: any;
    controlType?: any;
}) {
    return (
        <>
            <h2>{type}</h2>
            {sectionFieldArray.fields.map((section, index) => {
                if (section.type !== type) return null;
                return (
                    <div key={section.id}>
                        {controlType === controlTypes.SIMPLE ? (
                            <SimpleSectionEditor
                                index={index}
                                section={section}
                                register={register}
                                control={control}
                            />
                        ) : (
                            <SectionEditor index={index} section={section} register={register} control={control} />
                        )}
                        <RemoveItemButton fieldArray={sectionFieldArray} index={index} />
                    </div>
                );
            })}
            <ApphendItemButton
                fieldArray={sectionFieldArray}
                content={{
                    type,
                    controlType: controlType,
                    title: 'Section Title',
                    content: 'Add Content',
                }}
            />
        </>
    );
}

function ApphendItemButton({ fieldArray, content }) {
    return (
        <Button
            onClick={() => {
                fieldArray.append(content);
            }}
            size="sm"
        >
            + Add
        </Button>
    );
}

function RemoveItemButton({ fieldArray, index }) {
    return (
        <Button
            onClick={() => {
                fieldArray.remove(index);
            }}
            size="sm"
            color="danger"
        >
            + Remove
        </Button>
    );
}

function ThemeSelector({ setStyles }) {
    return (
        <div className="flex justify-end p-2 bg-gray-200">
            <label className="block text-gray-700 text-sm font-bold">
                Theme
                <select
                    className="border-gray-300 border-2 ml-2"
                    onChange={(event) => {
                        setStyles(themeMap[event.target.value]);
                    }}
                >
                    <option value="default">Default</option>
                    <option value="simple">Simple</option>
                </select>
            </label>
        </div>
    );
}

function ImageUpload({ imageId, uploadRef, setIsLoading, addToast, setValue }) {
    return (
        <div className="mb-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">Select Image (Maximum 10mb)</label>
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
                <Button
                    onClick={() => {
                        setValue('imageId', placeHolderImageId);
                        uploadRef.current.click();
                    }}
                    size="sm"
                    color="secondary"
                >
                    Change image
                </Button>
            </div>
        </div>
    );
}

export enum controlTypes {
    SIMPLE = 'simple',
    DEFAULT = 'default',
}
