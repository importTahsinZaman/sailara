/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
//import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "./firebase";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getFirestore,
  onSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";
import { Auth, onIdTokenChanged, User } from "firebase/auth";

export function useUserData(): any {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(getFirestore(), "users", user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        if (doc) setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}

// added this due to problems with react-firebase-hooks

export function useAuthState(auth: Auth): any {
  const [user, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    return onIdTokenChanged(auth, (_user) => {
      setCurrentUser(_user ?? null);
    });
  }, []);
  return [user];
}

export function useDocument(ref: DocumentReference): any {
  const [_doc, _setDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    return onSnapshot(ref, (snap) => {
      _setDoc(snap.exists() ? snap : null);
    });
  }, []);
  return [_doc];
}

export function useDocumentData(ref: DocumentReference): any {
  const [_doc, setDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    return onSnapshot(ref, (snap) => {
      setDoc(snap.exists() ? snap.data() : null);
    });
  }, []);
  return [_doc];
}

export function useDocumentDataOnce(ref: DocumentReference): any {
  const [_doc, setDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    getDoc(ref).then((snap) => {
      setDoc(snap.exists() ? snap.data() : null);
    });
    return;
  }, []);
  return [_doc];
}

export function useCollection(ref: Query): any {
  const [_doc, setDoc] = useState<QuerySnapshot | null>(null);

  useEffect(() => {
    // turn off realtime subscription
    return onSnapshot(ref, (snap) => {
      setDoc(!snap.empty ? snap : null);
    });
  }, []);
  return [_doc];
}
