import Link from "next/link";
import { UserContext } from "../lib/context";
import { useContext } from "react";
import { CreateEducatorCheckoutSession } from "../lib/stripe.js";

export default function Upgrade() {
  const { user, username, premium } = useContext(UserContext);
  return (
    <>
      {(user, username, !premium) ? (
        <button
          onClick={() => CreateEducatorCheckoutSession(user, username, premium)}
        >
          Upgrade
        </button>
      ) : (
        <>Already educator</>
      )}
    </>
  );
}
