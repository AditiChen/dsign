import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../context/firebaseSDK";

export default async function getSingleProject(projectId: string) {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, where("projectId", "==", projectId));
  const querySnapshot = await getDocs(q);
  const fetchedProjects: {
    author: string;
    uid: string;
    mainUrl: string;
    projectId: string;
    title: string;
    time: number;
    pages: {
      type: number;
      content?: string[];
      url?: string[];
      location?: { lat?: number; lng?: number };
    }[];
  }[] = [];
  querySnapshot.forEach((doc) => {
    fetchedProjects.push({
      projectId: doc.id,
      uid: doc.data().uid,
      author: doc.data().author,
      mainUrl: doc.data().mainUrl,
      title: doc.data().title,
      time: doc.data().time,
      pages: doc.data().pages,
    });
  });
  return fetchedProjects;
}
