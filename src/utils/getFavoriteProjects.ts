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

async function getProjects(list: string[]) {
  const usersRef = collection(db, "projects");
  const firstFriendQuery = query(usersRef, where("projectId", "in", list));
  const querySnapshot = await getDocs(firstFriendQuery);
  const fetchedProjects: FetchedProjectsType[] = [];
  querySnapshot.forEach((project) => {
    fetchedProjects.unshift({
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

export default async function getFavoriteProjects(favoriteList: string[]) {
  if (favoriteList.length === 0) return undefined;
  const fetchedProjects = [] as FetchedProjectsType[];
  await new Promise((resolve) => {
    let currentFetchedProjectIds: string[] = [];
    async function checkLength() {
      if (favoriteList.length - currentFetchedProjectIds.length <= 10) {
        const restList = [...favoriteList].slice(
          currentFetchedProjectIds.length,
          favoriteList.length
        );
        currentFetchedProjectIds = favoriteList;
        const newData = await getProjects(restList);
        fetchedProjects.push(...newData);
        resolve(fetchedProjects);
      } else {
        const getTenList = [...favoriteList].slice(
          currentFetchedProjectIds.length,
          currentFetchedProjectIds.length + 10
        );
        currentFetchedProjectIds.push(...getTenList);
        const newData = await getProjects(getTenList);
        fetchedProjects.push(...newData);
        await checkLength();
      }
    }
    checkLength();
  });

  return fetchedProjects;
}
