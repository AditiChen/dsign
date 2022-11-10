import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import ReactLoading from "react-loading";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";

import Message from "../../components/Message/Message";
import searchIcon from "./search-icon.png";
import messageIcon from "./chat-icon.png";
import deleteIcon from "./delete-friend-icon.png";
import deleteIconHover from "./delete-friend-icon-hover.png";

interface Prop {
  size?: string;
  color?: string;
  url?: string;
}

const Wrapper = styled.div`
  padding: 130px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  position: relative;
  margin: 20px auto 0;
  width: 70%;
  max-width: 800px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  height: 40px;
  width: 100%;
  border-radius: 5px;
  padding: 5px 45px 5px 20px;
  border: solid 1px #d4d4d4;
  font-size: 18px;
  line-height: 30px;
  color: #3c3c3c;
  background-color: #f0f0f090;
  &:focus {
    outline: none;
    background-color: #3c3c3c20;
  }
  &::placeholder {
    color: #616161;
  }
`;

const SearchIcon = styled.div`
  height: 30px;
  width: 30px;
  position: absolute;
  right: 10px;
  background-image: url(${searchIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const FriendListContainer = styled.div`
  padding: 20px 30px;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f0f0f090;
  &:hover {
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
`;

const Avatar = styled.div`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    border: 1px solid #d4d4d4;
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
`;

const TextContainer = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  margin-bottom: 5px;
  color: ${(props: Prop) => props.color};
  font-size: ${(props: Prop) => props.size};
  background-color: #f0f0f000;
`;

const MessageIcon = styled.div`
  margin-top: 5px;
  width: 30px;
  height: 30px;
  background-image: url(${messageIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const BtnContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const SendRequestBtn = styled.button`
  margin-left: 10px;
  padding: 0 10px;
  height: 40px;
  font-size: 16px;
  background-color: #3c3c3c30;
  border: 1px solid gray;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
`;

const DeleteIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${deleteIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${deleteIconHover});
  }
`;

const Loading = styled(ReactLoading)`
  margin: 0 auto;
`;

function FriendList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const {
    friendRequests,
    friendDataList,
    setClickedUserId,
    setShowMessageFrame,
  } = useContext(FriendContext);
  const [inputValue, setInputValue] = useState("");
  const [hasSearchValue, setHasSearchValue] = useState(false);
  const [searchData, setSearchData] = useState<{
    requestUid?: string;
    name?: string;
    email?: string;
    avatar?: string;
  }>({});
  const [messageFriendDtl, setMessageFriendDtl] = useState<{
    friendUid: string;
    name: string;
    avatar: string;
  }>({ friendUid: "", name: "", avatar: "" });

  async function searchHandler() {
    const inputCheck = friendDataList.findIndex(
      (email) => email.email === inputValue
    );
    if (inputCheck !== -1) {
      alert("you are friend already");
      setHasSearchValue(false);
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", inputValue));
    const querySnapshot = await getDocs(q);
    let returnedData;
    querySnapshot.forEach((returnDoc) => {
      returnedData = {
        avatar: returnDoc.data().avatar,
        email: returnDoc.data().email,
        name: returnDoc.data().name,
        requestUid: returnDoc.data().uid,
      };
    });
    if (!returnedData) {
      alert(t("user_not_found"));
      setHasSearchValue(false);
      return;
    }
    setHasSearchValue(true);
    setSearchData(returnedData);
  }

  async function sendRequest() {
    const requestId = uuid();
    await setDoc(doc(db, "friendRequests", requestId), {
      from: userId,
      to: searchData.requestUid,
    });
    alert(t("sen_request_successfully"));
    setSearchData({});
    setHasSearchValue(false);
  }

  async function acceptRequestHandler(requestId: string) {
    const requestRef = collection(db, "friendRequests");
    const q = query(
      requestRef,
      where("from", "==", requestId),
      where("to", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    let docId = "";
    querySnapshot.forEach((responseDoc) => {
      docId = responseDoc.id;
    });
    await deleteDoc(doc(db, "friendRequests", docId));
    await updateDoc(doc(db, "users", userId), {
      friendList: arrayUnion(requestId),
    });
    await updateDoc(doc(db, "users", requestId), {
      friendList: arrayUnion(userId),
    });
    alert("you are friend now!");
  }
  async function rejectRequestHandler(requestId: string) {
    const ans = window.confirm("Are you sure that you want to refuse?");
    if (ans === false) return;
    const requestRef = collection(db, "friendRequests");
    const q = query(
      requestRef,
      where("from", "==", requestId),
      where("to", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    let docId = "";
    querySnapshot.forEach((responseDoc) => {
      docId = responseDoc.id;
    });
    await deleteDoc(doc(db, "friendRequests", docId));
  }

  async function deleteFriendHandler(friendId: string) {
    const ans = window.confirm(
      "Are you sure that you want to remove this friend?"
    );
    if (ans === false) return;
    const idRef = doc(db, "users", userId);
    await updateDoc(idRef, {
      friendList: arrayRemove(friendId),
    });
    const friendIdRef = doc(db, "users", friendId);
    await updateDoc(friendIdRef, {
      friendList: arrayRemove(userId),
    });
    alert("delete successfully");
  }

  async function messageHandler(
    friendUid: string,
    name: string,
    avatar: string
  ) {
    const friendData = { friendUid, name, avatar };
    setMessageFriendDtl(friendData);
    setShowMessageFrame(true);
  }

  return (
    <Wrapper>
      <Container>
        <Separator>
          <SearchContainer>
            <SearchInput
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              placeholder={t("search_friend")}
              value={inputValue}
            />
            <SearchIcon onClick={() => searchHandler()} />
          </SearchContainer>
        </Separator>
        {hasSearchValue ? (
          <Separator>
            <FriendListContainer>
              <Avatar url={`url(${searchData.avatar})`} />
              <TextContainer>
                <Text size="20px">{searchData.name}</Text>
                <Text color="#616161">{searchData.email}</Text>
              </TextContainer>
              <BtnContainer>
                <SendRequestBtn onClick={() => sendRequest()}>
                  {t("send_friend_request")}
                </SendRequestBtn>
              </BtnContainer>
            </FriendListContainer>
          </Separator>
        ) : (
          ""
        )}
        {friendRequests.length === 0 ? (
          ""
        ) : (
          <>
            <Separator>
              <Text size="20px">{t("request_list")}</Text>
            </Separator>
            {friendRequests.map((request) => (
              <Separator key={request.uid}>
                <FriendListContainer>
                  <Avatar url={`url(${request.avatar})`} />
                  <TextContainer>
                    <Text size="20px">{request.name}</Text>
                    <Text color="#616161">{request.email}</Text>
                  </TextContainer>
                  <BtnContainer>
                    <SendRequestBtn
                      onClick={() => acceptRequestHandler(request.uid)}
                    >
                      {t("accept_friend_request")}
                    </SendRequestBtn>
                    <SendRequestBtn
                      onClick={() => rejectRequestHandler(request.uid)}
                    >
                      {t("reject_friend_request")}
                    </SendRequestBtn>
                  </BtnContainer>
                </FriendListContainer>
              </Separator>
            ))}
          </>
        )}
        {friendDataList.length === 0 ? (
          ""
        ) : (
          <>
            <Separator>
              <Text size="20px">{t("friend_list")}</Text>
            </Separator>
            {friendDataList.map((user) => (
              <Separator key={user.uid}>
                <FriendListContainer>
                  <Avatar
                    url={`url(${user.avatar})`}
                    onClick={() => {
                      setClickedUserId(user.uid);
                      navigate("/userProfile");
                    }}
                  />
                  <TextContainer>
                    <Text size="20px">{user.name}</Text>
                    <Text color="#616161">{user.email}</Text>
                    <MessageIcon
                      onClick={() => {
                        messageHandler(user.uid, user.name, user.avatar);
                      }}
                    />
                  </TextContainer>
                  <BtnContainer>
                    <DeleteIcon onClick={() => deleteFriendHandler(user.uid)} />
                  </BtnContainer>
                </FriendListContainer>
              </Separator>
            ))}
          </>
        )}
        <Message messageFriendDtl={messageFriendDtl} />
      </Container>
    </Wrapper>
  );
}

export default FriendList;
