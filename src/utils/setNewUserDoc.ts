import { doc, setDoc } from "firebase/firestore";
import { db } from "../context/firebaseSDK";

export default async function setNewUserDoc(
  uid: string,
  name: string,
  email: string,
  avatar: string
) {
  const searchName = name.replace(/\s/g, "").toLowerCase();
  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    searchName,
    email,
    avatar,
    friendList: [],
    favoriteList: [],
    folders: [{ folderName: "Unsorted", photos: [] }],
    introduction: "",
  });
}
