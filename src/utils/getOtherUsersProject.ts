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
import { FetchedProjectsType } from "../components/tsTypes";

export default async function getOtherUsersProject(
  userId: string,
  friendList: string[]
) {
  const usersRef = collection(db, "projects");
  const otherUserQuery = query(
    usersRef,
    where("uid", "not-in", [userId, ...friendList]),
    limit(50)
  );
  const otherUserQuerySnapshot = await getDocs(otherUserQuery);
  const otherUserFetchedProjects: FetchedProjectsType[] = [];
  otherUserQuerySnapshot.forEach((project) => {
    otherUserFetchedProjects.unshift({
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
  const newOrder = otherUserFetchedProjects.sort(
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
      otherUserFetchedProjects[index].name = name;
      otherUserFetchedProjects[index].avatar = avatar;
      otherUserFetchedProjects[index].introduction = introduction;
    })
  );
  return otherUserFetchedProjects;
}
