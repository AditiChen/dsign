import i18next, { t as i18t } from "i18next";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";

import languageIcon from "./language-icon.png";
import logoIcon from "./Logo.png";
import memberIcon from "./user-icon.png";
import friendsIcon from "./friends-icon.png";

interface Prop {
  height?: string;
  img?: string;
  size?: string;
  borderBtm?: string;
  paddingBtm?: string;
  borderRadious?: string;
}

const laguages = [
  { code: "en", name: "English", country_code: "GB" },
  { code: "fr", name: "Français", country_code: "FR" },
  { code: "zh", name: "中文", country_code: "TW" },
  { code: "ja", name: "日本語", country_code: "JP" },
];

const Wrapper = styled.div`
  padding: 0 30px;
  width: 100vw;
  height: 80px;
  color: #c4c4c4;
  background-color: #3c3c3c;
  box-shadow: 0 1px 5px #3c3c3c;
  position: fixed;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  width: 155px;
  height: 45px;
  background-image: url(${logoIcon});
  &:hover {
    cursor: pointer;
  }
`;

const Context = styled(Link)<{ $color?: string; border: string }>`
  padding: 2px 0;
  margin-left: 40px;
  font-size: 20px;
  text-decoration: none;
  color: ${(props) => props.$color || "#c4c4c4"};
  border-bottom: ${(props) => props.border};
  & + & {
    margin-left: 32px;
  }
  &:hover {
    text-shadow: 0 0 2px #787878;
    cursor: pointer;
  }
`;

const RightContainer = styled.div`
  padding-right: 20px;
  display: flex;
`;

const LanguageOptionsContainer = styled.div`
  width: 110px;
  max-height: 0;
  position: absolute;
  top: 45px;
  right: -38px;
  overflow: hidden;
  transition: max-height 0.3s ease-in;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 3px #3c3c3c;
  z-index: 1;
`;

const LanguageOptionsInnerContainer = styled.div`
  padding: 10px;
`;

const Icon = styled.div`
  height: 35px;
  width: 35px;
  position: relative;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  border-radius: ${(props: Prop) => props.borderRadious};
  &:hover {
    cursor: pointer;
  }
  & + & {
    margin-left: 30px;
  }
  &:hover > ${LanguageOptionsContainer} {
    max-height: 170px;
  }
`;

const FriendNotificiation = styled.div`
  height: 12px;
  width: 12px;
  position: absolute;
  right: -4px;
  bottom: 2px;
  border-radius: 6px;
  background-color: #82ac7c;
`;

const Language = styled.div`
  padding-bottom: ${(props: Prop) => props.paddingBtm || "0"};
  font-size: ${(props: Prop) => props.size};
  color: #3c3c3c;
  border-bottom: ${(props: Prop) => props.borderBtm};
  text-align: center;
  & + & {
    margin-top: 16px;
  }
`;

const SignBtn = styled.button<{ $color?: string; backgroundColor?: string }>`
  margin-left: 30px;
  padding: 0 20px;
  height: 35px;
  color: ${(props) => props.$color || "#ffffff"};
  font-size: 18px;
  background-color: ${(props) => props.backgroundColor || "transparent"};
  border: 1px solid #616161;
  border-radius: 5px;
  &:hover {
    box-shadow: 1px 1px 5px #616161;
    cursor: pointer;
  }
`;

function LanguageOptions() {
  return (
    <LanguageOptionsContainer>
      <LanguageOptionsInnerContainer>
        <Language size="16px" borderBtm="1px solid #3c3c3c" paddingBtm="10px">
          {i18t("languages")}
        </Language>
        {laguages.map((lng) => (
          <Language
            key={`${lng.code}`}
            size="14px"
            onClick={() => {
              i18next.changeLanguage(lng.code);
            }}
          >
            {lng.name}
          </Language>
        ))}
      </LanguageOptionsInnerContainer>
    </LanguageOptionsContainer>
  );
}

function Header() {
  const { avatar, isLogin, logout } = useContext(AuthContext);
  const { setShowMessageFrame, friendRequests } = useContext(FriendContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [clickState, setClickState] = useState("");

  async function logoutHandler() {
    const ans = await Swal.fire({
      text: t("logout_confirm"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_yes_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_no_answer"),
    });
    if (ans.isDenied === true) return;
    logout();
    navigate("/login");
  }

  return (
    <Wrapper>
      <LeftContainer>
        <Logo
          to="portfolioBricks"
          onClick={() => {
            setClickState("");
            setShowMessageFrame(false);
          }}
        />
        {isLogin && (
          <>
            <Context
              $color="#f5dfa9"
              to="createNewProject"
              border={clickState === "create" ? "1px solid #f5dfa9" : "none"}
              onClick={() => {
                setClickState("create");
                setShowMessageFrame(false);
              }}
            >
              {t("create")}
            </Context>
            <Context
              to="favoriteList"
              border={clickState === "favorite" ? "1px solid #c4c4c4" : "none"}
              onClick={() => {
                setClickState("favorite");
                setShowMessageFrame(false);
              }}
            >
              {t("favorite_list")}
            </Context>
            <Context
              to="collection"
              border={
                clickState === "collection" ? "1px solid #c4c4c4" : "none"
              }
              onClick={() => {
                setClickState("collection");
                setShowMessageFrame(false);
              }}
            >
              {t("collection_list")}
            </Context>
          </>
        )}
      </LeftContainer>
      <RightContainer>
        {isLogin && (
          <>
            <Icon
              img={`url(${friendsIcon})`}
              onClick={() => {
                setClickState("");
                navigate("/friendList");
              }}
            >
              {friendRequests.length !== 0 && <FriendNotificiation />}
            </Icon>
            <Icon
              img={avatar ? `url(${avatar})` : `url(${memberIcon})`}
              borderRadious="18px"
              onClick={() => {
                setClickState("");
                setShowMessageFrame(false);
                navigate("/portfile");
              }}
            />
          </>
        )}
        <Icon img={`url(${languageIcon})`}>
          <LanguageOptions />
        </Icon>
        {isLogin ? (
          <SignBtn
            onClick={() => {
              setClickState("");
              logoutHandler();
            }}
          >
            {t("logout")}
          </SignBtn>
        ) : (
          <SignBtn
            $color="#3c3c3c"
            backgroundColor="#f5dfa9"
            onClick={() => {
              setClickState("");
              navigate("/login");
            }}
          >
            {t("login")}
          </SignBtn>
        )}
      </RightContainer>
    </Wrapper>
  );
}

export default Header;
