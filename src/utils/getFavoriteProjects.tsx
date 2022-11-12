import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
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

export default async function getFavoriteProjects(favoriteList: string[]) {
  const usersRef = collection(db, "projects");
  const firstFriendQuery = query(
    usersRef,
    where("projectId", "in", favoriteList)
  );
  const querySnapshot = await getDocs(firstFriendQuery);
  const fetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((project) => {
    fetchedProjects.unshift({
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
  fetchedProjects.map(async (project, index) => {
    const docSnap = await getDoc(doc(db, "users", project.uid));
    const { name, avatar } = docSnap.data() as {
      name: string;
      avatar: string;
    };
    fetchedProjects[index].name = name;
    fetchedProjects[index].avatar = avatar;
  });
  return fetchedProjects;
}