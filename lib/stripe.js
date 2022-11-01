import {
  collection,
  getFirestore,
  addDoc,
  onSnapshot,
} from "firebase/firestore";

import { auth } from "../lib/firebase";

import { UserContext } from "../lib/context";
import { useContext } from "react";

export async function CreateEducatorCheckoutSession() {
  const { user, username, premium } = useContext(UserContext);
  if ((user, username, !premium)) {
    const ref = collection(
      getFirestore(),
      "users",
      auth.currentUser.uid,
      "checkout_sessions"
    );

    const payload = {
      price: "price_1LeMqhGRi1AVJ1EusAVlw3Fg",
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    };

    var docRef = await addDoc(ref, payload);

    const snapshot = onSnapshot(docRef, (doc) => {
      const { error, url } = doc.data();
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });
  } else {
    console.log("Not premium or not logged in!");
  }
}
