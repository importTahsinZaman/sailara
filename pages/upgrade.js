import Link from "next/link";
import { createEducatorCheckoutSession } from "../lib/stripe.js";

export default function upgrade() {
  return (
    <>
      <Link href="/upgrade">
        <button className="btn-blue">Upgrade</button>
      </Link>
    </>
  );
}
