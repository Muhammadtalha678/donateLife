import { FirebaseApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

export type FirebaseSdks = {
    firebaseApp: FirebaseApp,
    auth: Auth,
    firestore: Firestore
}

export function getSdks(firebaseApp: FirebaseApp): FirebaseSdks {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}
