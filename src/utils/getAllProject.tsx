import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  limit,
} from "firebase/firestore";

import { db } from "../context/firebaseSDK";

interface FetchedProjectsType {
  uid: string;
  name?: string;
  avatar?: string;
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
}

export default async function getAllProject() {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, limit(50));
  const querySnapshot = await getDocs(q);
  const allFetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((project) => {
    allFetchedProjects.unshift({
      name: "",
      avatar: "",
      projectId: project.id,
      uid: project.data().uid,
      mainUrl: project.data().mainUrl,
      title: project.data().title,
      time: project.data().time,
      pages: project.data().pages,
    });
  });
  allFetchedProjects.map(async (project, index) => {
    const docSnap = await getDoc(doc(db, "users", project.uid));
    const { name, avatar } = docSnap.data() as {
      name: string;
      avatar: string;
    };
    allFetchedProjects[index].name = name;
    allFetchedProjects[index].avatar = avatar;
  });

  return allFetchedProjects;
}
