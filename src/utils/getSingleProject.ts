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

export default async function getSingleProject(projectId: string) {
  const usersRef = collection(db, "projects");
  const q = query(usersRef, where("projectId", "==", projectId));
  const querySnapshot = await getDocs(q);
  const fetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((project) => {
    fetchedProjects.push({
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
  await Promise.all(
    fetchedProjects.map(async (project, index) => {
      const docSnap = await getDoc(doc(db, "users", project.uid));
      const { name, avatar, introduction } = docSnap.data() as {
        name: string;
        avatar: string;
        introduction: string;
      };
      fetchedProjects[index].name = name;
      fetchedProjects[index].avatar = avatar;
      fetchedProjects[index].introduction = introduction;
    })
  );
  return fetchedProjects;
}
