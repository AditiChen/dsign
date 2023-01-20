import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../context/firebaseSDK";
import { FetchedProjectsType } from "../components/tsTypes";

export default async function getUserProjects(userId: string) {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, where("uid", "==", userId));
  const querySnapshot = await getDocs(q);
  const fetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((doc) => {
    const { uid, mainUrl, title, time, pages, introduction } = doc.data();
    fetchedProjects.unshift({
      projectId: doc.id,
      uid,
      mainUrl,
      title,
      time,
      pages,
      introduction,
    });
  });
  return fetchedProjects;
}
