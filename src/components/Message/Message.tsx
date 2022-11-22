import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
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
} from "firebase/firestore";

import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";
import sendIcon from "../../icons/send-icon.png";
import sendIconHover from "../../icons/send-icon-hover.png";

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  width: 350px;
  height: 500px;
  position: fixed;
  right: 5vw;
  bottom: 90px;
  background-color: #ffffff;
  border: 1px solid #3c3c3c60;
  border-radius: 10px;
  z-index: 20;
`;

const CloseIcon = styled.div`
  width: 30px;
  height: 30px;
  position: fixed;
  right: calc(5vw - 10px);
  bottom: 572px;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  z-index: 20;
  &:hover {
    cursor: pointer;
    background-image: url(${closeIconHover});
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
`;

const Atatar = styled.div`
  margin: 0 5px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-image: ${(props: Prop) => props.img};
  background-position: center;
  background-size: cover;
`;

const Name = styled.div`
  margin-left: 10px;
  font-size: 20px;
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
  border: 1px solid #3c3c3c60;
  border-radius: 5px;
  background-color: #ffffff90;
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
`;

const MessageInput = styled.input`
  height: 36px;
  width: 285px;
  border-radius: 20px;
  padding: 5px 45px 5px 15px;
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
`;

const SendMessageIcon = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  background-image: url(${sendIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${sendIconHover});
  }
`;

const Loading = styled(ReactLoading)`
  margin: auto;
`;

function Message({
  messageFriendDtl,
  userId,
}: {
  messageFriendDtl: {
    friendUid: string;
    name: string;
    avatar: string;
  };
  userId: string;
}) {
  const { setShowMessageFrame } = useContext(FriendContext);
  const [isLoading, setIsLoading] = useState(false);
  const [chatroomId, setChatroomId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [historyMessages, setHistoryMessages] = useState<
    {
      from?: string;
      message?: string;
      time?: Timestamp;
    }[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    setHistoryMessages([]);
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
          onlineUserIds: [],
        });
        setChatroomId(roomId);
      }
    }
    checkRoomExist();
    setIsLoading(false);
  }, [messageFriendDtl]);

  useEffect(() => {
    if (chatroomId === "") return undefined;
    setIsLoading(true);
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
  }, [chatroomId]);

  async function sendMesssageHandler() {
    if (inputValue === "") return;
    setInputValue("");
    const messageId = `${+new Date()}`;
    await setDoc(doc(db, `chatrooms/${chatroomId}/messages/${messageId}/`), {
      from: userId,
      message: `${inputValue}`,
      time: new Date(),
    });
  }

  return (
    <Wrapper>
      <CloseIcon onClick={() => setShowMessageFrame((prev) => !prev)} />
      <Container>
        <AvatarContainer>
          <Atatar img={`url(${messageFriendDtl.avatar})`} />
          <Name>{messageFriendDtl.name}</Name>
        </AvatarContainer>
        <MessageContainer>
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
                sendMesssageHandler();
              }
            }}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            value={inputValue}
          />
          <SendMessageIcon onClick={() => sendMesssageHandler()} />
        </SendMessageContainer>
      </Container>
    </Wrapper>
  );
}

export default Message;
