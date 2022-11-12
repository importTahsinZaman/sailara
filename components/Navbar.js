import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Top navbar
export default function Navbar() {
  const { user, username, premium } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">Sailara</button>
          </Link>
        </li>

        {/* user is signed-in and has username and is premium*/}
        {username && premium && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Manage Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || "/hacker.png"} />
              </Link>
            </li>
          </>
        )}

        {/* user is signed-in and has username but is not premium*/}
        {username && !premium && (
          <>
            <li className="push-left">
              <Link href="/upgrade">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || "/hacker.png"} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <>
            <li className="push-left">
              <Link href="/enter">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
