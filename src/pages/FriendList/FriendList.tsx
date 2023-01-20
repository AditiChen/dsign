import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
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
import Swal from "sweetalert2";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";
import Message from "../../components/Message/Message";
import {
  SearchFriendDataType,
  MessageFriendDtlType,
} from "../../components/tsTypes";
import {
  Wrapper,
  Container,
  Separator,
  SearchContainer,
  SearchInput,
  SearchIcon,
  SwitchClickStatusContainer,
  SwitchClickStatusBtn,
  NotificationDot,
  FriendListContainer,
  Avatar,
  TextContainer,
  Text,
  MessageIcon,
  BtnContainer,
  SendRequestBtn,
  DeleteIcon,
  Loading,
} from "../../components/StyledComponents/FriendListStyledComponents";

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
  const [searchData, setSearchData] = useState<SearchFriendDataType>({});
  const [messageFriendDtl, setMessageFriendDtl] =
    useState<MessageFriendDtlType>({
      friendUid: "",
      name: "",
      avatar: "",
      chatroomId: "",
    });
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
