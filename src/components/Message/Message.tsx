import styled from "styled-components";
import { useContext, useEffect, useState, useRef } from "react";
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
  onSnapshot,
  Timestamp,
  getDoc,
  arrayUnion,
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";
import useOnClickOutside from "../../utils/useOnClickOutside";
import { MessageFriendDtlType, HistoryMessageDataType } from "../tsTypes";
import {
  closeIcon,
  closeIconHover,
  sendMessageIcon,
  sendMessageIconHover,
} from "../icons/icons";

const Wrapper = styled.div`
  width: 350px;
  height: 500px;
  position: fixed;
  right: 5vw;
  bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #3c3c3c60;
  border-radius: 10px;
  z-index: 20;
  @media screen and (max-width: 399px) {
    width: 280px;
    right: 10px;
  }
`;

const CloseIcon = styled.div`
  width: 30px;
  height: 30px;
  position: fixed;
  right: calc(5vw - 10px);
  bottom: 496px;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  z-index: 20;
  &:hover {
    cursor: pointer;
    background-image: url(${closeIconHover});
  }
  @media screen and (max-width: 399px) {
    width: 24px;
    height: 24px;
    right: 5px;
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const AvatarContainer = styled.div`
  width: 100%;
  height: 50px;
  padding: 5px 5px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px #3c3c3c80;
  @media screen and (max-width: 399px) {
    height: 40px;
  }
`;

const Avatar = styled.div<{ url?: string }>`
  margin: 0 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-image: ${(props) => props.url};
  background-position: center;
  background-size: cover;
  @media screen and (max-width: 399px) {
    width: 30px;
    height: 30px;
  }
`;

const Name = styled.div`
  margin-left: 10px;
  font-size: 20px;
  @media screen and (max-width: 399px) {
    margin-left: 0;
    font-size: 16px;
  }
`;

const MessageContainer = styled.div`
  padding: 10px 10px 0;
  height: 400px;
  background-color: #f0f0f090;
  overflow: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 399px) {
    height: 420px;
  }
`;

const MessageInnerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SingleMessageLeft = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  width: 250px;
  font-size: 18px;
  word-wrap: break-word;
  border: 1px solid #3c3c3c60;
  border-radius: 5px;
  background-color: #ffffff90;
  @media screen and (max-width: 399px) {
    margin-bottom: 8px;
    padding: 8px;
    width: 200px;
    font-size: 14px;
  }
`;

const SingleMessageRight = styled(SingleMessageLeft)`
  margin-left: auto;
`;

const SendMessageContainer = styled.div`
  height: 50px;
  padding: 5px 5px 5px 10px;
  position: relative;
  display: flex;
  align-items: center;
  box-shadow: 0 -1px 3px #3c3c3c60;
  @media screen and (max-width: 399px) {
    height: 40px;
  }
`;

const MessageInput = styled.input`
  height: 36px;
  width: 285px;
  border-radius: 20px;
  padding: 5px 15px;
  border: solid 1px #d4d4d4;
  font-size: 18px;
  line-height: 30px;
  background-color: #f0f0f090;
  &:focus {
    outline: none;
    background-color: #3c3c3c20;
  }
  &::placeholder {
    color: #616161;
  }
  @media screen and (max-width: 399px) {
    height: 30px;
    width: 230px;
  }
`;

const SendMessageIcon = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  background-image: url(${sendMessageIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${sendMessageIconHover});
  }
  @media screen and (max-width: 399px) {
    margin-left: 5px;
    height: 24px;
    width: 24px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: auto;
`;

function Message({
  messageFriendDtl,
  userId,
}: {
  messageFriendDtl: MessageFriendDtlType;
  userId: string;
}) {
  const { t } = useTranslation();
  const { setShowMessageFrame } = useContext(FriendContext);
  const [isLoading, setIsLoading] = useState(false);
  const [chatroomId, setChatroomId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [historyMessages, setHistoryMessages] = useState<
    HistoryMessageDataType[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    if (messageFriendDtl.chatroomId !== "") {
      updateDoc(doc(db, `chatrooms/${messageFriendDtl.chatroomId}`), {
        onlineUserIds: arrayUnion(userId),
        unread: "",
      });
      setChatroomId(messageFriendDtl.chatroomId);
      setIsLoading(false);
      return;
    }
    async function checkRoomExist() {
      const messageRef = collection(db, "chatrooms");
      const q1 = query(
        messageRef,
        where("owners", "in", [[messageFriendDtl.friendUid, userId]])
      );
      const q2 = query(
        messageRef,
        where("owners", "in", [[userId, messageFriendDtl.friendUid]])
      );

      const querySnapshot1 = await getDocs(q1);
      let docId1;
      querySnapshot1.forEach((responseDoc) => {
        docId1 = responseDoc.id;
      });
      const querySnapshot2 = await getDocs(q2);
      let docId2;
      querySnapshot2.forEach((responseDoc) => {
        docId2 = responseDoc.id;
      });

      if (docId1) {
        setChatroomId(docId1);
      }
      if (docId2) {
        setChatroomId(docId2);
      }
      if (
        docId1 === undefined &&
        docId2 === undefined &&
        messageFriendDtl.friendUid !== ""
      ) {
        const roomId = uuid();
        await setDoc(doc(db, "chatrooms", roomId), {
          owners: [userId, messageFriendDtl.friendUid],
          unread: "",
          onlineUserIds: [userId],
        });
        setChatroomId(roomId);
      }
    }
    checkRoomExist();
    setIsLoading(false);
  }, [messageFriendDtl, userId]);

  useEffect(() => {
    if (chatroomId === "") return undefined;
    setIsLoading(true);
    updateDoc(doc(db, "chatrooms", chatroomId), {
      onlineUserIds: arrayUnion(userId),
    });
    const q = query(collection(db, `chatrooms/${chatroomId}/messages`));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const messages: { from: string; message: string; time: Timestamp }[] = [];
      querySnapshot.forEach((returnedDoc) => {
        const data = {
          from: returnedDoc.data().from,
          message: returnedDoc.data().message,
          time: returnedDoc.data().time.toDate(),
        };
        messages.push(data);
      });
      setHistoryMessages(messages || {});
    });
    setIsLoading(false);
    return () => unsubscribe();
  }, [chatroomId, userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [historyMessages]);

  async function sendMessageHandler() {
    if (inputValue.trim() === "") {
      Swal.fire({
        text: t("empty_message"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setInputValue("");
      return;
    }
    setInputValue("");
    const messageId = `${+new Date()}`;
    const docSnap = await getDoc(doc(db, `chatrooms/${chatroomId}`));
    const chatroomData = docSnap.data() as {
      onlineUserIds: string[];
      owners: string[];
      unread: string;
    };
    const checkFriendOnlineStatus = chatroomData.onlineUserIds.indexOf(
      messageFriendDtl.friendUid
    );
    if (checkFriendOnlineStatus === -1) {
      updateDoc(doc(db, `chatrooms/${chatroomId}`), {
        unread: messageFriendDtl.friendUid,
      });
    }
    await setDoc(doc(db, `chatrooms/${chatroomId}/messages/${messageId}/`), {
      from: userId,
      message: `${inputValue}`,
      time: new Date(),
    });
  }

  function closeMessageFrame() {
    updateDoc(doc(db, `chatrooms/${chatroomId}`), {
      onlineUserIds: arrayRemove(userId),
    });
    setShowMessageFrame((prev) => !prev);
  }

  useOnClickOutside(messageWindowRef, () => closeMessageFrame());

  return (
    <Wrapper ref={messageWindowRef}>
      <CloseIcon onClick={() => closeMessageFrame()} />
      <Container>
        <AvatarContainer>
          <Avatar url={`url(${messageFriendDtl.avatar})`} />
          <Name>{messageFriendDtl.name}</Name>
        </AvatarContainer>
        <MessageContainer ref={scrollRef}>
          {isLoading ? (
            <Loading type="cylon" color="#3c3c3c" />
          ) : (
            <MessageInnerContainer>
              {historyMessages &&
                historyMessages.map((message) => {
                  if (message.from === userId) {
                    return (
                      <SingleMessageRight key={`${message.time}`}>
                        {message.message}
                      </SingleMessageRight>
                    );
                  }
                  return (
                    <SingleMessageLeft key={`${message.time}`}>
                      {message.message}
                    </SingleMessageLeft>
                  );
                })}
            </MessageInnerContainer>
          )}
        </MessageContainer>
        <SendMessageContainer>
          <MessageInput
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessageHandler();
              }
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            value={inputValue}
            maxLength={100}
          />
          <SendMessageIcon onClick={() => sendMessageHandler()} />
        </SendMessageContainer>
      </Container>
    </Wrapper>
  );
}

export default Message;
