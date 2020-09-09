import useFirebaseAuthentication from '../hooks/auth';
import Link from 'next/link';

export default function NavBar() {
    const { authUser, logout } = useFirebaseAuthentication();

    return (
        <nav className="flex items-center justify-between flex-wrap bg-blue-700 p-3">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">Zen Resume</span>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow"></div>
                <div>
                    {!authUser ? (
                        <Link href="/login">
                            <a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
                                Log In
                            </a>
                        </Link>
                    ) : (
                        <a
                            href="#"
                            onClick={() => logout()}
                            className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
                        >
                            Log Out
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
}
