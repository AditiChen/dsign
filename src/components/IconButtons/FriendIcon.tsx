import { useContext, useState } from "react";
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
import Swal from "sweetalert2";
import ReactLoading from "react-loading";

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

const Loading = styled(ReactLoading)``;

export default function FriendIcon({ requestId }: { requestId: string }) {
  const { t } = useTranslation();
  const { userId } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  async function addFriendHandler() {
    setIsLoading(true);
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
      Swal.fire({
        text: t("already_sent_request"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      setIsLoading(false);
      return;
    }
    const newDocId = uuid();
    await setDoc(doc(db, "friendRequests", newDocId), {
      from: userId,
      to: requestId,
    });
    Swal.fire({ text: t("sen_request_successfully"), icon: "success" });
    setIsLoading(false);
  }
  if (isLoading)
    return <Loading type="spokes" color="#3c3c3c" height={25} width={25} />;
  return <Friend onClick={() => addFriendHandler()} />;
}
