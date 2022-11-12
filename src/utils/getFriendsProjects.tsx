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

export default async function getFriendsProjects(
  userId: string,
  friendList: string[]
) {
  const usersRef = collection(db, "projects");
  const firstFriendQuery = query(
    usersRef,
    where("uid", "in", [userId, ...friendList])
    // limit(50)
  );
  const firstFriendquerySnapshot = await getDocs(firstFriendQuery);
  const firstFriendFetchedProjects: FetchedProjectsType[] = [];
  firstFriendquerySnapshot.forEach((project) => {
    firstFriendFetchedProjects.unshift({
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
  firstFriendFetchedProjects.map(async (project, index) => {
    const docSnap = await getDoc(doc(db, "users", project.uid));
    const { name, avatar } = docSnap.data() as {
      name: string;
      avatar: string;
    };
    firstFriendFetchedProjects[index].name = name;
    firstFriendFetchedProjects[index].avatar = avatar;
  });

  return firstFriendFetchedProjects;
}
