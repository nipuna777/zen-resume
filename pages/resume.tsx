import styles from '../styles/Resume.module.css';
import { useForm, Controller } from 'react-hook-form';
import TextInput from '../components/text-input';
import TextAreaInput from '../components/text-area-input';

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

export default function Resume() {
    const { control, register, watch } = useForm<any>({
        defaultValues: {
            title: 'Nipuna Gunathilake',
            telephone: '+65123456789',
            email: 'nipuna777@gmail.com',
            address: 'Ruwan\nPittiyegedara',
            imageUrl: 'https://nipuna777.com/static/7fff478813639d31c953af6a47d57c9b/6e63d/nipuna-profile.jpg',
            value:
                'To excel as a professional, in the fields of Accountancy and financial management while delivering best service possible in achieving organizational objectives.',
        },
    });
    const sections = [0, 1];

    const fieldValues = watch();
    const { title, telephone, email, address, imageUrl } = fieldValues;
    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <form style={{ width: 555, margin: 10 }}>
                <TextInput label="Title" inputRef={register} name="title" />
                <TextInput label="Image URL" inputRef={register} name="imageUrl" />
                <TextInput label="Email" inputRef={register} name="telephone" />
                <TextInput label="Telephone" inputRef={register} name="email" />
                <TextAreaInput label="Address" inputRef={register} name="address" />

                {sections.map((section, i) => {
                    return (
                        <>
                            <TextInput label={`Section ${i} title`} inputRef={register} name={`sectionTitle${i}`} />
                            {ReactQuill ? (
                                <Controller
                                    as={ReactQuill}
                                    name={`sectionValue${i}`}
                                    control={control}
                                    defaultValue=""
                                />
                            ) : null}
                        </>
                    );
                })}
            </form>
            <div className={styles.container}>
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
                        <img className={styles.headerContentImage} src={imageUrl} alt="profile photo" />
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
