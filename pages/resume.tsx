import styles from '../styles/Resume.module.css';
import { useForm } from 'react-hook-form';
import TextInput from '../components/text-input';

export async function getStaticProps(context) {
    return {
        props: {
            title: 'Nipuna Gunathilake',
        },
    };
}

export default function Resume() {
    const { register, watch } = useForm({
        defaultValues: {
            title: 'Nipuna Gunathilake',
            telephone: '+65123456789',
            email: 'nipuna777@gmail.com',
        },
    });

    const fieldValues = watch();
    const { title, telephone, email } = fieldValues;

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <form style={{ width: 500, margin: 10 }}>
                <TextInput label="Title" inputRef={register} name="title" />
                <TextInput label="Email" inputRef={register} name="telephone" />
                <TextInput label="Telephone" inputRef={register} name="email" />
            </form>
            <div className={styles.container}>
                {/* editor modal container */}
                <header className={styles.header}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    <div className={styles.headerContent}>
                        <div className={styles.headerContentDesc}>
                            <br />
                            <strong>{telephone}</strong>
                            <br />
                            <span className="email">{email}</span>
                        </div>
                        <img
                            className={styles.headerContentImage}
                            src="https://nipuna777.com/static/7fff478813639d31c953af6a47d57c9b/6e63d/nipuna-profile.jpg"
                            alt="profile photo"
                        />
                    </div>
                </header>
            </div>
        </div>
    );
}
