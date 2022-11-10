import styled from "@emotion/styled";
import { useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { db } from "../../context/firebaseSDK";

import closeIcon from "./close-icon.png";
import sendIcon from "./send-icon.png";

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  width: 350px;
  height: 500px;
  position: fixed;
  right: 5vw;
  bottom: 8vh;
  background-color: #ffffff;
  border: 1px solid #3c3c3c80;
  border-radius: 10px;
  z-index: 20;
`;

const CloseIcon = styled.div`
  width: 30px;
  height: 30px;
  position: fixed;
  right: calc(5vw - 15px);
  bottom: calc(8vh + 485px);
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  z-index: 20;
  &:hover {
    cursor: pointer;
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
  box-shadow: 1px 0 3px #3c3c3c80;
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

const MessageContainer = styled.div`
  padding: 10px;
  height: 400px;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f090;
`;

const SendMessageContainer = styled.div`
  height: 50px;
  padding: 5px;
  position: relative;
  display: flex;
  align-items: center;
`;

const MessageInput = styled.input`
  height: 40px;
  width: 290px;
  border-radius: 20px;
  padding: 5px 45px 5px 10px;
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

const SendMessageIcon = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  background-image: url(${sendIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
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
  const [chatroomId, setChatroomId] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
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
      if (docId1 === undefined && docId2 === undefined) {
        const roomId = uuid();
        await setDoc(doc(db, "chatrooms", roomId), {
          owners: [userId, messageFriendDtl.friendUid],
        });
        setChatroomId(roomId);
      }
    }
    checkRoomExist();
  }, []);

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
          <div>{messageFriendDtl.name}</div>
        </AvatarContainer>
        <MessageContainer>
          <div>message</div>
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
