import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "../context/firebaseSDK";
import { FetchedProjectsType } from "../components/tsTypes";

export default async function getFriendsProjects(
  userId: string,
  friendList: string[]
) {
  const usersRef = collection(db, "projects");
  const firstFriendQuery = query(
    usersRef,
    where("uid", "in", [userId, ...friendList])
  );
  const friendQuerySnapshot = await getDocs(firstFriendQuery);
  const fetchedFriendProjects: FetchedProjectsType[] = [];
  friendQuerySnapshot.forEach((project) => {
    fetchedFriendProjects.unshift({
      name: "",
      avatar: "",
      introduction: "",
      projectId: project.id,
      uid: project.data().uid,
      mainUrl: project.data().mainUrl,
      title: project.data().title,
      time: project.data().time,
      pages: project.data().pages,
    });
  });
  const newOrder = fetchedFriendProjects.sort(
    (a, b) => Number(b.projectId) - Number(a.projectId)
  );
  await Promise.all(
    newOrder.map(async (project, index) => {
      const docSnap = await getDoc(doc(db, "users", project.uid));
      const { name, avatar, introduction } = docSnap.data() as {
        name: string;
        avatar: string;
        introduction: string;
      };
      fetchedFriendProjects[index].name = name;
      fetchedFriendProjects[index].avatar = avatar;
      fetchedFriendProjects[index].introduction = introduction;
    })
  );

  return fetchedFriendProjects;
}
