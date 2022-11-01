import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { premium } = useContext(UserContext);

  return premium
    ? props.children
    : props.fallback || <Link href="/enter">Must have Educator Account</Link>;
}
