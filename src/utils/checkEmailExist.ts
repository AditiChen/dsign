import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../context/firebaseSDK";

export default async function checkEmailExist(email: string) {
  const userRef = collection(db, "users");
  const qEmail = query(userRef, where("email", "==", email));
  const querySnapshotEmail = await getDocs(qEmail);
  const emailRefReturnedData = querySnapshotEmail.docs[0]?.data();
  return emailRefReturnedData;
}
