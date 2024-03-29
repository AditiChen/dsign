import { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { db } from "../../context/firebaseSDK";
import { LikeIconPropsType } from "../tsTypes";
import { likeIcon, likeIconHover, likedIcon } from "../icons/icons";

export const Liked = styled.div<{
  margin: string;
  $width: string;
  $height: string;
}>`
  margin: ${(props) => props.margin};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 1449px) {
    width: 24px;
    height: 24px;
  }
  @media screen and (max-width: 949px) {
    width: 18px;
    height: 18px;
  }
`;

export const Like = styled.div<{
  margin: string;
  $width: string;
  $height: string;
}>`
  margin: ${(props) => props.margin};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  background-image: url(${likeIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${likeIconHover});
  }
  @media screen and (max-width: 1449px) {
    width: 24px;
    height: 24px;
  }
  @media screen and (max-width: 949px) {
    width: 18px;
    height: 18px;
  }
`;

export function LikeIcon({
  projectId,
  width,
  height,
  margin,
}: LikeIconPropsType) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);

  async function likeProjectHandler() {
    if (userId === "") {
      const ans = await Swal.fire({
        text: t("please_login"),
        icon: "warning",
        confirmButtonColor: "#6d79aa",
        confirmButtonText: t("to_login_page"),
        showCancelButton: true,
        cancelButtonText: t("login_later"),
      });
      if (ans.isDismissed === true) return;
      navigate("login");
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(projectId),
    });
  }
  return (
    <Like
      margin={margin}
      $width={width}
      $height={height}
      onClick={() => likeProjectHandler()}
    />
  );
}

export function LikedIcon({
  projectId,
  width,
  height,
  margin,
}: {
  projectId: string;
  margin: string;
  width: string;
  height: string;
}) {
  const { userId } = useContext(AuthContext);
  async function dislikeProjectHandler() {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(projectId),
    });
  }
  return (
    <Liked
      margin={margin}
      $width={width}
      $height={height}
      onClick={() => dislikeProjectHandler()}
    />
  );
}
