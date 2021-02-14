import Head from 'next/head';
import Link from 'next/link';
import useFirebaseAuthentication from '../hooks/auth';

export default function Home() {
    const { authUser } = useFirebaseAuthentication();

    return (
        <div className="flex flex-col justify-center items-center flex-1">
            <Head>
                <title>Zen Resume</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-1 flex-col justify-center items-center">
                <h1 className="size text-5xl">Zen Resume</h1>

                <p className="text-xl">Create and edit resume online</p>

                <div className="flex items-center justify-center flex-wrap max-w-3xl mt-8">
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

            <footer className="w-full border-t-2 p-2 border-gray-300 flex justify-center self-center">
                Created by&nbsp;
                <a className="text-blue-700 underline" href="https://nipuna777.com">
                    nipuna777
                </a>
            </footer>
        </div>
    );
}
