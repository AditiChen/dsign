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
  introduction: string;
  title: string;
  time: number;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
}

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

  // get next 50 datas
  // const lastFriendVisible =
  //   firstFriendquerySnapshot.docs[firstFriendquerySnapshot.docs.length - 1];
  // const nextFriendQuery = query(
  //   collection(db, "projects"),
  //   where("uid", "in", [userId, ...friendList]),
  //   startAfter(lastFriendVisible),
  //   limit(50)
  // );
  // const nextFriendQuerySnapshot = await getDocs(nextFriendQuery);
  // const nextFriendFetchedProjects: FetchedProjectsType[] = [];
  // nextFriendQuerySnapshot.forEach((doc) => {
  //   nextFriendFetchedProjects.push({
  //     projectId: doc.id,
  //     uid: doc.data().uid,
  //     mainUrl: doc.data().mainUrl,
  //     title: doc.data().title,
  //     time: doc.data().time,
  //     pages: doc.data().pages,
  //   });
  // });

  return otherUserFetchedProjects;
}
