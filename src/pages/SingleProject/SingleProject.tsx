import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { db } from "../../context/firebaseSDK";

import templatesArr from "../../components/singleProjectPageTemplates/TemplatesArr";
import { GoogleMapAPI } from "../../components/singleProjectPageTemplates/GoogleMapAPI";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import getSingleProject from "../../utils/getSingleProject";

import arrowIcon from "../../icons/arrow-icon-white.png";
import arrowIconHover from "../../icons/arrow-icon-hover.png";
import likeIcon from "../../icons/like-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";
import likedIcon from "../../icons/liked-icon.png";
import addFriendIcon from "../../icons/add-friend-icon.png";
import addFriendIconHover from "../../icons/add-friend-icon-hover.png";

interface UserProjectType {
  uid: string;
  name?: string;
  avatar?: string;
  introduction?: string;
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
  display: flex;
  position: relative;
  background-color: #3c3c3c90;
`;

const ArrowIcon = styled.div`
  height: 35px;
  width: 35px;
  position: absolute;
  top: 110px;
  left: 50px;
  background-image: url(${arrowIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${arrowIconHover});
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  min-height: 840px;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 20px black;
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  padding: 12px 20px;
  height: 80px;
  display: flex;
  align-items: flex-end;
`;

const Title = styled.div`
  font-size: 30px;
  color: #3c3c3c;
  font-weight: 700;
`;

const UserInfoContainer = styled.div`
  max-height: 0;
  overflow: hidden;
  background-color: #fff;
  transition: max-height 0.3s ease-in;
  box-shadow: 0 0 5px black;
  border-radius: 10px;
  position: absolute;
  z-index: 2;
  top: 44px;
  right: 0;
`;

const UserInfoInnerContainer = styled.div`
  padding: 20px 15px;
  max-height: 150px;
  width: 310px;
`;

const UserInfoHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InfoAvatar = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const Intor = styled.div`
  margin: 10px 0;
  font-size: 18px;
  line-height: 22px;
  color: #616161;
`;

const Author = styled.div`
  margin-left: 10px;
  color: #3c3c3c;
  font-size: 24px;
`;

const AddFriendIcon = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-size: cover;
  background-position: center;
  background-image: url(${addFriendIcon});
  &:hover {
    background-image: url(${addFriendIconHover});
  }
`;

const Avatar = styled.div<{ img: string }>`
  margin-left: auto;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover > ${UserInfoContainer} {
    max-height: 150px;
  }
`;

const LikedIcon = styled.div`
  margin-left: 20px;
  width: 36px;
  height: 36px;
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const LikeIcon = styled(LikedIcon)`
  background-image: url(${likeIcon});
  &:hover {
    background-image: url(${likeIconHover});
  }
`;

const MapContainer = styled.div`
  width: 1200px;
  height: 700px;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function SingleProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });
  const { userId, singleProjectId, favoriteList, friendList } =
    useContext(AuthContext);
  const { setClickedUserId } = useContext(FriendContext);
  const [singleProjectData, setSingleProjectData] = useState<UserProjectType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const result = await getSingleProject(singleProjectId);
      setSingleProjectData(result);
      setIsLoading(false);
    }
    getData();
  }, []);

  async function likeProjectHandler(clickProjectId: string) {
    if (userId === "") {
      alert(t("please_login"));
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(clickProjectId),
    });
  }

  async function dislikeProjectHandler(clickProjectId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(clickProjectId),
    });
  }

  async function addFriendHandler() {
    const requestId = uuid();

    await setDoc(doc(db, "friendRequests", requestId), {
      from: userId,
      to: singleProjectData[0]?.uid,
    });
    alert(t("sen_request_successfully"));
  }

  const types = singleProjectData[0]?.pages?.map((data) => data.type);
  const templateFilter = types?.map((num) => templatesArr[num]);
  const googleMap = templatesArr[8];

  return (
    <Wrapper>
      <ArrowIcon onClick={() => navigate(-1)} />
      <Container>
        {isLoading || !isLoaded ? (
          <Loading type="cylon" color="#3c3c3c" />
        ) : (
          <>
            <HeaderContainer>
              <Title>{singleProjectData && singleProjectData[0]?.title}</Title>
              <Avatar img={`url(${singleProjectData[0]?.avatar})`}>
                <UserInfoContainer>
                  <UserInfoInnerContainer>
                    <UserInfoHeaderContainer>
                      <InfoAvatar
                        img={`url(${singleProjectData[0]?.avatar})`}
                        onClick={() => {
                          setClickedUserId(singleProjectData[0]?.uid);
                          navigate("/userProfile");
                        }}
                      />
                      <Author>{singleProjectData[0]?.name}</Author>
                      {friendList.indexOf(singleProjectData[0]?.uid) === -1 &&
                      singleProjectData[0]?.uid !== userId &&
                      userId !== "" ? (
                        <AddFriendIcon onClick={() => addFriendHandler()} />
                      ) : (
                        ""
                      )}
                    </UserInfoHeaderContainer>
                    <Intor>{singleProjectData[0]?.introduction}</Intor>
                  </UserInfoInnerContainer>
                </UserInfoContainer>
              </Avatar>
              {favoriteList.indexOf(singleProjectId) === -1 ? (
                <LikeIcon onClick={() => likeProjectHandler(singleProjectId)} />
              ) : (
                <LikedIcon
                  onClick={() => dislikeProjectHandler(singleProjectId)}
                />
              )}
            </HeaderContainer>
            {singleProjectData.length === 0 ? (
              ""
            ) : (
              <>
                {templateFilter.map((Template, index) => {
                  if (Template === googleMap) {
                    return (
                      <MapContainer key={`${index + 1}`}>
                        <GoogleMapAPI
                          position={
                            (singleProjectData &&
                              singleProjectData[0]?.pages[index].location) ||
                            {}
                          }
                        />
                      </MapContainer>
                    );
                  }
                  return (
                    <Template
                      key={`${index + 1}`}
                      photoUrl={
                        (singleProjectData &&
                          singleProjectData[0]?.pages[index].url) ||
                        []
                      }
                      content={
                        (singleProjectData &&
                          singleProjectData[0]?.pages[index].content) ||
                        []
                      }
                    />
                  );
                })}
              </>
            )}
          </>
        )}
      </Container>
    </Wrapper>
  );
}

export default SingleProject;
