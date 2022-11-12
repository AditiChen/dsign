import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";

import likeIcon from "../../icons/like-icon.png";
import likedIcon from "../../icons/liked-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";

interface Prop {
  img?: string;
  url?: string;
}

interface FetchedProjectsType {
  uid: string;
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

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const BannerContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 700px;
  background-color: #00000090;
`;

const Text = styled.div`
  padding: 50px;
  color: white;
  font-size: 50px;
  text-align: center;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  width: 1300px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(4, auto);
  border: 1px solid black;
`;

const SingleProjectContainer = styled.div`
  margin: 0 auto 5px auto;
  width: 300px;
  height: 350px;
  border: 1px solid black;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightblue;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  border: 1px solid black;
`;

const Author = styled.div`
  margin-left: 10px;
  font-size: 18px;
`;

const LikedIcon = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
`;

const LikeIcon = styled(LikedIcon)`
  background-image: url(${likeIcon});
  &:hover {
    background-image: url(${likeIconHover});
  }
`;

function PortfolioBricks() {
  const { userId } = useContext(AuthContext);
  const [isLike, setIsLike] = useState(false);
  const [prokects, setProjects] = useState<FetchedProjectsType[]>([]);

  useEffect(() => {
    async function getProjects() {
      const usersRef = collection(db, "projects");
      const firstQuery = query(usersRef, orderBy("time"), limit(5));
      const querySnapshot = await getDocs(firstQuery);
      const fetchedProjects: FetchedProjectsType[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProjects.push({
          projectId: doc.id,
          uid: doc.data().uid,
          mainUrl: doc.data().mainUrl,
          title: doc.data().title,
          time: doc.data().time,
          pages: doc.data().pages,
        });
      });
      setProjects(fetchedProjects);
      console.log("fetchedProjects", fetchedProjects);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const nextQuery = query(
        collection(db, "projects"),
        orderBy("time"),
        startAfter(lastVisible),
        limit(5)
      );
      const nextQuerySnapshot = await getDocs(nextQuery);
      const nextFetchedProjects: FetchedProjectsType[] = [];
      nextQuerySnapshot.forEach((doc) => {
        nextFetchedProjects.push({
          projectId: doc.id,
          uid: doc.data().uid,
          mainUrl: doc.data().mainUrl,
          title: doc.data().title,
          time: doc.data().time,
          pages: doc.data().pages,
        });
      });

      console.log("next", nextFetchedProjects);
    }
    getProjects();
  }, []);

  function likeProjectHandler() {
    console.log("like");
  }

  return (
    <Wrapper>
      <BannerContainer>
        <Text>Banner</Text>
      </BannerContainer>
      <BricksContainer>
        {prokects.map((project) => (
          <SingleProjectContainer key={uuid()}>
            <ImgContainer img={`url(${project.mainUrl})`} />
            <InfoContainer>
              <Avatar />
              <Author>Orange</Author>
              {isLike ? (
                <LikedIcon />
              ) : (
                <LikeIcon onClick={() => likeProjectHandler()} />
              )}
            </InfoContainer>
          </SingleProjectContainer>
        ))}
      </BricksContainer>
    </Wrapper>
  );
}

export default PortfolioBricks;
