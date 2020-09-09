import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import useFirebaseAuthentication from '../hooks/auth';

export default function Home() {
    const { authUser } = useFirebaseAuthentication();

    return (
        <div className={styles.container}>
            <Head>
                <title>Zen Resume</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Zen Resume</h1>

                <p className={styles.description}>Create and edit resume online</p>

                <div className={styles.grid}>
                    {!authUser ? (
                        <Link href="/login">
                            <a>
                                <h3>Login to create resume &rarr;</h3>
                            </a>
                        </Link>
                    ) : (
                        <Link href="/resume">
                            <a>
                                <h3>Continue editing resume &rarr;</h3>
                            </a>
                        </Link>
                    )}
                </div>
            </main>

            <footer className={styles.footer}>
                Created by&nbsp;
                <a href="https://nipuna777.com">nipuna777</a>
            </footer>
        </div>
    );
}
