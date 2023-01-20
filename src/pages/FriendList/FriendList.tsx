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
import {
  searchIcon,
  openMessageIcon,
  openMessageIconHover,
  deleteFriendIcon,
  deleteFriendIconHover,
} from "../../components/icons/icons";

const Wrapper = styled.div`
  padding: 30px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  position: relative;
  display: flex;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    padding: 20px 0;
  }
  @media screen and (max-width: 799px) {
    padding: 10px 0;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1499px) {
    width: 1000px;
  }
`;

const Separator = styled.div`
  position: relative;
  margin: 20px auto 0;
  width: 70%;
  max-width: 800px;
  @media screen and (max-width: 799px) {
    width: 80%;
  }
  @media screen and (max-width: 499px) {
    margin-top: 10px;
    width: 90%;
  }
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
  background-color: #f0f0f090;
  &:focus {
    outline: none;
    background-color: #3c3c3c20;
  }
  &::placeholder {
    color: #b4b4b4;
  }
  @media screen and (max-width: 799px) {
    height: 35px;
    font-size: 12px;
    padding: 5px 35px 5px 10px;
  }
`;

const SearchIcon = styled.div`
  height: 26px;
  width: 26px;
  position: absolute;
  right: 15px;
  background-image: url(${searchIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 799px) {
    height: 22px;
    width: 22px;
    right: 10px;
  }
`;

const SwitchClickStatusContainer = styled.div`
  height: 40px;
  display: flex;
`;

const SwitchClickStatusBtn = styled.div<{ color: string; border: string }>`
  margin: 5px 0;
  color: ${(props) => props.color};
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  border-bottom: ${(props) => props.border};
  position: relative;
  &:hover {
    cursor: pointer;
    color: #3c3c3c;
  }
  & + & {
    margin-left: 30px;
  }
  @media screen and (max-width: 1449px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    font-size: 16px;
    & + & {
      margin-left: 10px;
    }
  }
`;

const NotificationDot = styled.div<{ top?: string; right?: string }>`
  height: 10px;
  width: 10px;
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  border-radius: 50%;
  background-image: linear-gradient(#89b07e, #4f8365);
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
  @media screen and (max-width: 799px) {
    padding: 10px;
  }
`;

const Avatar = styled.div<{ url?: string }>`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  border: 1px solid #f0f0f0;
  &:hover {
    cursor: pointer;
    border: 1px solid #d4d4d4;
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
  @media screen and (max-width: 799px) {
    height: 60px;
    width: 60px;
  }
`;

const TextContainer = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 799px) {
    margin-left: 10px;
  }
`;

const Text = styled.div<{
  $color?: string;
  $size?: string;
  mobileSize?: string;
}>`
  margin-bottom: 5px;
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$size};
  background-color: #f0f0f000;
  @media screen and (max-width: 799px) {
    font-size: ${(props) => props.mobileSize};
  }
`;

const MessageIcon = styled.div`
  margin-top: 5px;
  width: 30px;
  height: 30px;
  background-image: url(${openMessageIcon});
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover {
    cursor: pointer;
    background-image: url(${openMessageIconHover});
  }
  @media screen and (max-width: 799px) {
    margin-top: 0;
    height: 22px;
    width: 22px;
  }
`;

const BtnContainer = styled.div`
  margin-left: auto;
  display: flex;
  @media screen and (max-width: 799px) {
    flex-direction: column;
  }
`;

const SendRequestBtn = styled.button`
  padding: 0 10px;
  height: 40px;
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
  @media screen and (max-width: 799px) {
    padding: 0 5px;
    width: 60px;
    height: 30px;
    font-size: 12px;
    border-radius: 5px;
    & + & {
      margin-left: 0;
      margin-top: 5px;
    }
  }
`;

const DeleteIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${deleteFriendIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${deleteFriendIconHover});
  }
  @media screen and (max-width: 799px) {
    height: 24px;
    width: 24px;
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
    showMessageFrame,
    setShowMessageFrame,
    unreadMessages,
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
    chatroomId: string;
  }>({ friendUid: "", name: "", avatar: "", chatroomId: "" });
  const [clickState, setClickState] = useState("list");

  async function searchHandler() {
    const inputCheckEmail = friendDataList.findIndex(
      (data) => data.email === inputValue
    );
    const lowerCaseInputValue = inputValue.toLowerCase();
    const inputCheckName = friendDataList.findIndex(
      (data) => data.searchName === lowerCaseInputValue
    );

    if (inputCheckEmail !== -1 || inputCheckName !== -1) {
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
    const qName = query(
      userRef,
      where("searchName", "==", lowerCaseInputValue)
    );
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
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;

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
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
      denyButtonColor: "tomato",
    });
    if (ans.isConfirmed === true) return;

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
          <Loading type="cylon" color="#3c3c3c" />
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
              maxLength={30}
              value={inputValue}
            />
            <SearchIcon onClick={() => searchHandler()} />
          </SearchContainer>
        </Separator>
        {hasSearchValue && (
          <Separator>
            <FriendListContainer>
              <Avatar
                url={`url(${searchData.avatar})`}
                onClick={() => {
                  navigate(`/userProfile?id=${searchData.uid}`);
                }}
              />
              <TextContainer>
                <Text $size="20px" mobileSize="16px">
                  {searchData.name}
                </Text>
                <Text color="#616161" mobileSize="12px">
                  {searchData.email}
                </Text>
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
          <SwitchClickStatusContainer>
            <SwitchClickStatusBtn
              color={clickState === "list" ? "#3c3c3c" : "#b4b4b4"}
              border={clickState === "list" ? "1px solid #3c3c3c" : "none"}
              onClick={() => setClickState("list")}
            >
              {t("friend_list")}
            </SwitchClickStatusBtn>
            <SwitchClickStatusBtn
              color={clickState === "request" ? "#3c3c3c" : "#b4b4b4"}
              border={clickState === "request" ? "1px solid #3c3c3c" : "none"}
              onClick={() => setClickState("request")}
            >
              {t("request_list")}
              {friendRequests.length !== 0 && (
                <NotificationDot top="0px" right="-10px" />
              )}
            </SwitchClickStatusBtn>
          </SwitchClickStatusContainer>
        </Separator>
        {clickState === "request" && friendRequests.length === 0 && (
          <Separator>
            <Text $size="16px" mobileSize="12px">
              {t("no_friend_request")}
            </Text>
          </Separator>
        )}
        {clickState === "request" &&
          friendRequests.length !== 0 &&
          friendRequests.map((request) => (
            <Separator key={request.uid}>
              <FriendListContainer>
                <Avatar url={`url(${request.avatar})`} />
                <TextContainer>
                  <Text $size="20px" mobileSize="16px">
                    {request.name}
                  </Text>
                  <Text color="#616161" mobileSize="12px">
                    {request.email}
                  </Text>
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
                    navigate(`/userProfile?id=${user.uid}`);
                  }}
                />
                <TextContainer>
                  <Text $size="20px" mobileSize="16px">
                    {user.name}
                  </Text>
                  <Text color="#616161" mobileSize="12px">
                    {user.email}
                  </Text>
                  <MessageIcon
                    onClick={() => {
                      const chatroomId = unreadMessages.find(
                        (room) => room.friendId === user.uid
                      );
                      setMessageFriendDtl({
                        friendUid: user.uid,
                        name: user.name,
                        avatar: user.avatar,
                        chatroomId: chatroomId?.chatroomId || "",
                      });
                      setShowMessageFrame(true);
                    }}
                  >
                    {unreadMessages.length !== 0 &&
                      unreadMessages.map((friendId) => {
                        if (friendId.friendId !== user.uid) return null;
                        return (
                          <NotificationDot
                            key={friendId.friendId}
                            top="-2px"
                            right="-5px"
                          />
                        );
                      })}
                  </MessageIcon>
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
