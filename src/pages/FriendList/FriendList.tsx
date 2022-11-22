import styled from "styled-components";
import { useContext, useState } from "react";
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
import Swal from "sweetalert2";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";
import Message from "../../components/Message/Message";

import searchIcon from "../../icons/search-icon.png";
import messageIcon from "../../icons/chat-icon.png";
import messageIconHover from "../../icons/chat-icon-hover.png";
import deleteIcon from "../../icons/delete-friend-icon.png";
import deleteIconHover from "../../icons/delete-friend-icon-hover.png";

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
  border-radius: 20px;
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
    color: #b4b4b4;
  }
`;

const SearchIcon = styled.div`
  height: 28px;
  width: 28px;
  position: absolute;
  right: 15px;
  background-image: url(${searchIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const SwichClickStatusContainer = styled.div`
  height: 40px;
  display: flex;
`;

const SwichClickStatusBtn = styled.div<{ color: string; border: string }>`
  margin: 5px 0;
  color: ${(props) => props.color};
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  border-bottom: ${(props) => props.border};
  &:hover {
    cursor: pointer;
    color: #3c3c3c;
  }
  & + & {
    margin-left: 30px;
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
    background-image: url(${messageIconHover});
  }
`;

const BtnContainer = styled.div`
  margin-left: auto;
  display: flex;
`;

const SendRequestBtn = styled.button`
  padding: 0 10px;
  height: 40px;
  color: #3c3c3c;
  font-size: 18px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
  & + & {
    margin-left: 10px;
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
  const { userId, isLoading } = useContext(AuthContext);
  const {
    friendRequests,
    friendDataList,
    setClickedUserId,
    showMessageFrame,
    setShowMessageFrame,
  } = useContext(FriendContext);
  const [inputValue, setInputValue] = useState("");
  const [hasSearchValue, setHasSearchValue] = useState(false);
  const [searchData, setSearchData] = useState<{
    uid?: string;
    name?: string;
    email?: string;
    avatar?: string;
  }>({});
  const [messageFriendDtl, setMessageFriendDtl] = useState<{
    friendUid: string;
    name: string;
    avatar: string;
  }>({ friendUid: "", name: "", avatar: "" });
  const [clickState, setClickState] = useState("list");

  async function searchHandler() {
    const inputCheck = friendDataList.findIndex(
      (email) => email.email === inputValue
    );
    if (inputCheck !== -1) {
      Swal.fire({
        text: t("already_friend"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setHasSearchValue(false);
      setInputValue("");
      return;
    }

    const userRef = collection(db, "users");
    const qEmail = query(userRef, where("email", "==", inputValue));
    const querySnapshotEmail = await getDocs(qEmail);
    const emailRefReturnedData = querySnapshotEmail.docs[0]?.data();
    const qName = query(userRef, where("name", "==", inputValue));
    const querySnapshotName = await getDocs(qName);
    const nameRefReturnedData = querySnapshotName.docs[0]?.data();
    if (
      emailRefReturnedData === undefined &&
      nameRefReturnedData === undefined
    ) {
      Swal.fire({
        text: t("user_not_found"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setHasSearchValue(false);
      setInputValue("");
      return;
    }

    const returnId = emailRefReturnedData?.uid || nameRefReturnedData?.uid;
    const requestRef = collection(db, "friendRequests");
    const q2 = query(
      requestRef,
      where("from", "==", userId),
      where("to", "==", returnId)
    );
    const querySnapshot2 = await getDocs(q2);
    let docId = "";
    querySnapshot2.forEach((responseDoc) => {
      docId = responseDoc.id;
    });

    if (docId !== "") {
      Swal.fire({
        text: t("already_sent_request"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setHasSearchValue(false);
      setInputValue("");
      return;
    }

    setHasSearchValue(true);
    setInputValue("");
    setSearchData(emailRefReturnedData || nameRefReturnedData);
  }

  async function sendRequest() {
    const requestId = uuid();
    await setDoc(doc(db, "friendRequests", requestId), {
      from: userId,
      to: searchData.uid,
    });
    Swal.fire({
      text: t("sen_request_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
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
    Swal.fire({
      text: t("be_friend"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
  }

  async function rejectRequestHandler(requestId: string) {
    const ans = await Swal.fire({
      text: t("confirm_reject"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_yes_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_no_answer"),
    });
    if (ans.isDenied === true) return;

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
    const ans = await Swal.fire({
      text: t("confirm_remove"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_yes_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_no_answer"),
    });
    if (ans.isDenied === true) return;

    const idRef = doc(db, "users", userId);
    await updateDoc(idRef, {
      friendList: arrayRemove(friendId),
    });
    const friendIdRef = doc(db, "users", friendId);
    await updateDoc(friendIdRef, {
      friendList: arrayRemove(userId),
    });
    Swal.fire({
      text: t("delete_successfully"),
      confirmButtonColor: "#646464",
    });
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Container>
          <Loading />
        </Container>
      </Wrapper>
    );
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
        {hasSearchValue && (
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
        )}
        <Separator>
          <SwichClickStatusContainer>
            <SwichClickStatusBtn
              color={clickState === "list" ? "#3c3c3c" : "#b4b4b4"}
              border={clickState === "list" ? "1px solid #3c3c3c" : "none"}
              onClick={() => setClickState("list")}
            >
              {t("friend_list")}
            </SwichClickStatusBtn>
            <SwichClickStatusBtn
              color={clickState === "request" ? "#3c3c3c" : "#b4b4b4"}
              border={clickState === "request" ? "1px solid #3c3c3c" : "none"}
              onClick={() => setClickState("request")}
            >
              {t("request_list")}
            </SwichClickStatusBtn>
          </SwichClickStatusContainer>
        </Separator>
        {clickState === "request" && friendRequests.length === 0 && (
          <Separator>
            <Text size="20px"> {t("no_friend_request")}</Text>
          </Separator>
        )}
        {clickState === "request" &&
          friendRequests.length !== 0 &&
          friendRequests.map((request) => (
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
        {clickState === "list" &&
          friendDataList.length !== 0 &&
          friendDataList.map((user) => (
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
                      setMessageFriendDtl({
                        friendUid: user.uid,
                        name: user.name,
                        avatar: user.avatar,
                      });
                      setShowMessageFrame(true);
                    }}
                  />
                </TextContainer>
                <BtnContainer>
                  <DeleteIcon onClick={() => deleteFriendHandler(user.uid)} />
                </BtnContainer>
              </FriendListContainer>
            </Separator>
          ))}
        {showMessageFrame && (
          <Message messageFriendDtl={messageFriendDtl} userId={userId} />
        )}
      </Container>
    </Wrapper>
  );
}

export default FriendList;
