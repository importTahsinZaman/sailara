import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { auth, firestore } from "./firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "./reactFirebaseHooks.ts";

// Custom hook to read  auth record and user profile doc

async function isUserPremium() {
  await auth.currentUser.getIdToken(true);
  const decodedToken = await auth.currentUser?.getIdTokenResult();
  return decodedToken?.claims?.stripeRole ? true : false;
}

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [premium, setPremium] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      // const ref = firestore.collection('users').doc(user.uid);
      const ref = doc(getFirestore(), "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });

      const checkPremiumStatus = async function () {
        setPremium(await isUserPremium());
      };
      checkPremiumStatus();
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, premium };
}
