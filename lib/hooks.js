import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

export function useUserData() {
  // https://github.com/csfrequency/react-firebase-hooks/tree/09bf06b28c82b4c3c1beabb1b32a8007232ed045/auth#useauthstate
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // https://firebase.google.com/docs/firestore/query-data/listen
    let unsub;

    if (user) {
      unsub = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        setUsername(doc.data()?.username);
    });  
    } else {
      setUsername(null);
    }

    return unsub;
  }, [user]);

  return { user, username };
}