import Link from "next/link";
import { CreateEducatorCheckoutSession } from "../lib/stripe.js";

export default function Upgrade() {
  return (
    <>
      <button className="btn-blue" onClick={CreateEducatorCheckoutSession}>
        Upgrade
      </button>
    </>
  );
}
