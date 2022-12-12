import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Top navbar
export default function Navbar({}) {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    {/* https://nextjs.org/docs/api-reference/next/link */}
                    <Link href="/">
                        <button>FEED</button>
                    </Link>
                </li>

                {/* user is signed-in and has a username */}
                {username && (
                    <>
                    <li>
                        <Link href="/admin">
                            <button className="btn-blue">Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL} />
                        </Link>
                    </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}