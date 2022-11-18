import i18next, { t as i18t } from "i18next";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

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

const Context = styled(Link)<{ $color?: string }>`
  padding: 10px 10px;
  margin-left: 20px;
  font-size: 20px;
  text-decoration: none;
  color: ${(props) => props.$color || "#c4c4c4"};
  & + & {
    margin-left: 12px;
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
  const { setShowMessageFrame } = useContext(FriendContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  function logoutHandler() {
    const ans = window.confirm(t("logout_confirm"));
    if (ans === false) return;
    logout();
    navigate("/login");
  }

  return (
    <Wrapper>
      <LeftContainer>
        <Logo to="portfolioBricks" onClick={() => setShowMessageFrame(false)} />
        {isLogin ? (
          <>
            <Context
              $color="#f5dfa9"
              to="createNewProject"
              onClick={() => setShowMessageFrame(false)}
            >
              {t("create")}
            </Context>
            <Context
              to="favoriteList"
              onClick={() => setShowMessageFrame(false)}
            >
              {t("favorite_list")}
            </Context>
            <Context to="collection" onClick={() => setShowMessageFrame(false)}>
              {t("collection_list")}
            </Context>
          </>
        ) : (
          ""
        )}
      </LeftContainer>
      <RightContainer>
        {isLogin ? (
          <>
            <Icon
              img={`url(${friendsIcon})`}
              onClick={() => {
                navigate("/friendList");
              }}
            />
            <Icon
              img={avatar ? `url(${avatar})` : `url(${memberIcon})`}
              borderRadious="18px"
              onClick={() => {
                setShowMessageFrame(false);
                navigate("/portfile");
              }}
            />
          </>
        ) : (
          ""
        )}
        <Icon img={`url(${languageIcon})`}>
          <LanguageOptions />
        </Icon>
        {isLogin ? (
          <SignBtn
            onClick={() => {
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
