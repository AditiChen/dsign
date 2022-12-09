import {
  collection,
  getDocs,
  query,
  getDoc,
  doc,
  limit,
} from "firebase/firestore";

import { db } from "../context/firebaseSDK";
import { FetchedProjectsType } from "../components/tsTypes";

export default async function getAllProject() {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, limit(50));
  const querySnapshot = await getDocs(q);
  const allFetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((project) => {
    allFetchedProjects.unshift({
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
  const newOrder = allFetchedProjects.sort(
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
      allFetchedProjects[index].name = name;
      allFetchedProjects[index].avatar = avatar;
      allFetchedProjects[index].introduction = introduction;
    })
  );

  return allFetchedProjects;
}
