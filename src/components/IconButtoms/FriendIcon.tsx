import { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { AuthContext } from "../../context/authContext";
import { db } from "../../context/firebaseSDK";

import addFriendIcon from "../../icons/add-friend-icon.png";
import addFriendIconHover from "../../icons/add-friend-icon-hover.png";

const Friend = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-image: url(${addFriendIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${addFriendIconHover});
  }
`;

export default function FriendIcon({ requestId }: { requestId: string }) {
  const { t } = useTranslation();
  const { userId } = useContext(AuthContext);

  async function addFriendHandler() {
    const requestRef = collection(db, "friendRequests");
    const q2 = query(
      requestRef,
      where("from", "==", userId),
      where("to", "==", requestId)
    );
    const querySnapshot2 = await getDocs(q2);
    let docId = "";
    querySnapshot2.forEach((responseDoc) => {
      docId = responseDoc.id;
    });
    if (docId !== "") {
      alert(t("already_sent_request"));
      return;
    }
    const newDocId = uuid();
    await setDoc(doc(db, "friendRequests", newDocId), {
      from: userId,
      to: requestId,
    });
    alert(t("sen_request_successfully"));
  }

  return <Friend onClick={() => addFriendHandler()} />;
}
