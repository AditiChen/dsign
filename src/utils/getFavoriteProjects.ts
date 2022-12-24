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

export default async function getFavoriteProjects(favoriteList: string[]) {
  if (favoriteList.length === 0) return undefined;
  const currentFetchList = [] as FetchedProjectsType[];

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

  await new Promise((resolve) => {
    let currentList: string[] = [];
    async function checkLength() {
      if (favoriteList.length - currentList.length <= 10) {
        const restList = [...favoriteList].slice(
          currentList.length,
          favoriteList.length
        );
        currentList = favoriteList;
        const newData = await getProjects(restList);
        currentFetchList.push(...newData);
        resolve(currentFetchList);
      } else {
        const getTenList = [...favoriteList].slice(
          currentList.length,
          currentList.length + 10
        );
        currentList.push(...getTenList);
        const newData = await getProjects(getTenList);
        currentFetchList.push(...newData);
        await checkLength();
      }
    }
    checkLength();
  });

  return currentFetchList;
}
