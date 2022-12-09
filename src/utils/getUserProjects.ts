import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../context/firebaseSDK";
import { FetchedProjectsType } from "../components/tsTypes";

export default async function getUserProjects(userId: string) {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, where("uid", "==", userId));
  const querySnapshot = await getDocs(q);
  const fetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((doc) => {
    fetchedProjects.unshift({
      projectId: doc.id,
      uid: doc.data().uid,
      mainUrl: doc.data().mainUrl,
      title: doc.data().title,
      time: doc.data().time,
      pages: doc.data().pages,
      introduction: doc.data().introduction,
    });
  });
  return fetchedProjects;
}
