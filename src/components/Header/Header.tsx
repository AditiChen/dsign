import i18next, { t as i18t } from "i18next";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useContext, useRef, Dispatch, SetStateAction } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import useOnClickOutside from "../../utils/useOnClickOutside";
import {
  languageIcon,
  logoIcon,
  memberIcon,
  friendsIcon,
  menuIcon,
} from "../icons/icons";

interface Prop {
  height?: string;
  maxHeight?: string;
  maxWidth?: string;
  right?: string;
  bottom?: string;
  img?: string;
  size?: string;
  $color?: string;
  border?: string;
  borderBtm?: string;
  paddingBtm?: string;
  borderRadius?: string;
  backgroundColor?: string;
}

const languages = [
  { code: "en", name: "English", country_code: "GB" },
  { code: "fr", name: "Français", country_code: "FR" },
  { code: "zh", name: "中文", country_code: "TW" },
  { code: "ja", name: "日本語", country_code: "JP" },
];

const Wrapper = styled.div`
  width: 100vw;
  height: 60px;
  color: #c4c4c4;
  position: relative;
  z-index: 10;
  @media screen and (max-width: 949px) {
    height: 50px;
  }
`;

const Container = styled.div`
  padding: 0 30px;
  width: 100vw;
  height: 60px;
  background-color: #3c3c3c;
  box-shadow: 0 1px 5px #3c3c3c;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 949px) {
    height: 50px;
  }
  @media screen and (max-width: 799px) {
    padding: 0 16px;
    height: 50px;
    justify-content: center;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  width: 146px;
  height: 42px;
  background-image: url(${logoIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    width: 124px;
    height: 36px;
  }
  @media screen and (max-width: 799px) {
    width: 93px;
    height: 27px;
  }
`;

const PageLink = styled(Link)`
  margin-left: 40px;
  padding-top: 10px;
  font-size: 18px;
  text-decoration: none;
  color: ${(props: Prop) => props.$color || "#c4c4c4"};
  border-bottom: ${(props: Prop) => props.border};
  background-image: linear-gradient(180deg, transparent 95%, #c4c4c4 0);
  background-repeat: no-repeat;
  background-size: 0 100%;
  transition: background-size 0.4s ease;
  width: fit-content;
  & + & {
    margin-left: 32px;
  }
  &:hover {
    text-shadow: 0 0 2px #787878;
    cursor: pointer;
    background-size: 100% 100%;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    margin-left: 20px;
    font-size: 16px;
    & + & {
      margin-left: 20px;
    }
  }
  @media screen and (max-width: 799px) {
    display: none;
  }
`;

const RightContainer = styled.div`
  display: flex;
  @media screen and (max-width: 799px) {
    display: none;
  }
`;

const LanguageOptionsContainer = styled.div`
  width: 110px;
  max-height: ${(props: Prop) => props.maxHeight};
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

const LanguageContainer = styled.div`
  margin-left: 28px;
  position: relative;
  @media screen and (min-width: 800px) and (max-width: 949px) {
    margin-left: 20px;
  }
`;

const Icon = styled.div`
  height: 35px;
  width: 35px;
  position: relative;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  border-radius: ${(props: Prop) => props.borderRadius};
  &:hover {
    cursor: pointer;
  }
  & + & {
    margin-left: 30px;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    height: 30px;
    width: 30px;
    & + & {
      margin-left: 20px;
    }
  }
`;

const NotificationDot = styled.div`
  height: 12px;
  width: 12px;
  position: absolute;
  right: ${(props: Prop) => props.right};
  bottom: ${(props: Prop) => props.bottom};
  border-radius: 50%;
  background-image: linear-gradient(#89b07e, #4f8365);
  @media screen and (max-width: 949px) {
    height: 10px;
    width: 10px;
  }
`;

const LanguageHeader = styled.div`
  width: 100%;
  text-align: center;
  padding: 10px 5px;
  color: #3c3c3c;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #3c3c3c;
  &:hover {
    cursor: default;
  }
`;

const LanguageOptionsText = styled.div`
  padding: 10px 0;
  font-size: 14px;
  color: ${(props: Prop) => props.$color};
  text-align: center;
  background-color: ${(props: Prop) => props.backgroundColor};
  &:hover {
    background-color: #787878;
    color: white;
    cursor: pointer;
  }
  @media screen and (max-width: 799px) {
    font-size: 12px;
    &:nth-child(4) {
      border-bottom: 1px solid #c4c4c4;
    }
  }
`;

const SignBtn = styled.button`
  margin-left: 30px;
  padding: 0 20px;
  height: 35px;
  color: ${(props: Prop) => props.$color || "#c4c4c4"};
  font-size: 16px;
  background-color: ${(props: Prop) => props.backgroundColor || "transparent"};
  border: 1px solid #616161;
  border-radius: 5px;
  &:hover {
    box-shadow: 1px 1px 5px #616161;
    cursor: pointer;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    margin-left: 20px;
    padding: 0 10px;
    height: 30px;
    font-size: 14px;
    align-self: flex-end;
  }
  @media screen and (max-width: 799px) {
    margin: 5px auto;
    font-size: 14px;
  }
`;

const MobileMenuContainer = styled.div`
  margin-right: 10px;
  display: none;
  position: fixed;
  right: 10px;
  @media screen and (max-width: 799px) {
    display: block;
  }
`;

const MenuIcon = styled.div`
  height: 26px;
  width: 26px;
  background-image: url(${menuIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const MobileContainer = styled.div`
  max-height: ${(props: Prop) => props.maxHeight};
  width: 200px;
  position: fixed;
  right: 0px;
  top: 50px;
  background-color: #3c3c3c;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: max-height 0.5s ease-in;
  box-shadow: -1px 0 5px #3c3c3c;
`;

const MobileLanguageContext = styled.div`
  padding: 15px 10px;
  width: 100%;
  height: 45px;
  color: #c4c4c4;
  font-size: 14px;
  border-bottom: 1px solid #c4c4c4;
  &:hover {
    cursor: pointer;
  }
`;

const MobileLanguageContainer = styled.div`
  max-height: ${(props: Prop) => props.maxHeight};
  overflow: hidden;
  transition: max-height 0.3s ease-in;
`;

const MobileLanguageInnerContainer = styled.div`
  height: 129px;
`;

const MobileContext = styled(Link)`
  padding: 15px 10px;
  width: 100%;
  height: 45px;
  color: #c4c4c4;
  font-size: 14px;
  text-decoration: none;
  position: relative;
  border-bottom: 1px solid #c4c4c4;
`;

function LanguageOptions({
  isShowLanguages,
  activeLanguageIndex,
  setActiveLanguageIndex,
}: {
  isShowLanguages: boolean;
  activeLanguageIndex: number;
  setActiveLanguageIndex: Dispatch<SetStateAction<number>>;
}) {
  return (
    <LanguageOptionsContainer maxHeight={isShowLanguages ? "180px" : "0"}>
      <LanguageHeader>{i18t("languages")}</LanguageHeader>
      {languages.map((lng, index) => (
        <LanguageOptionsText
          key={`${lng.code}`}
          $color={activeLanguageIndex === index ? "#3c3c3c" : "#3c3c3c90"}
          backgroundColor={activeLanguageIndex === index ? "#d4d4d4" : "none"}
          onClick={() => {
            i18next.changeLanguage(lng.code);
            setActiveLanguageIndex(index);
          }}
        >
          {lng.name}
        </LanguageOptionsText>
      ))}
    </LanguageOptionsContainer>
  );
}

function getCurrentLanguageFromCookie() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("i18next="))
    ?.split("=")[1];
  const currentLanguageIndex = languages.findIndex(
    (language) => language.code === cookieValue
  );
  return currentLanguageIndex;
}

function Header() {
  const { avatar, isLogin, logout } = useContext(AuthContext);
  const { setShowMessageFrame, friendRequests, unreadMessages } =
    useContext(FriendContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isShowLanguages, setIsShowLanguages] = useState(false);
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false);
  const [isShowMobileLanguages, setIsShowMobileLanguages] = useState(false);
  const [activeLanguageIndex, setActiveLanguageIndex] = useState(
    getCurrentLanguageFromCookie
  );
  const languageRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLanguageRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(languageRef, () => setIsShowLanguages(false));
  useOnClickOutside(mobileMenuRef, () => setIsShowMobileMenu(false));
  useOnClickOutside(mobileLanguageRef, () => setIsShowMobileLanguages(false));

  async function logoutHandler() {
    const ans = await Swal.fire({
      text: t("logout_confirm"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
      denyButtonColor: "tomato",
    });
    if (ans.isConfirmed === true) return;
    logout();
    navigate("/login");
  }

  return (
    <Wrapper>
      <Container>
        <LeftContainer>
          <Logo
            to="/"
            onClick={() => {
              setShowMessageFrame(false);
            }}
          />
          {isLogin && (
            <>
              <PageLink
                $color="#f5dfa9"
                to="createNewProject"
                border={
                  location.pathname === "/createNewProject"
                    ? "1px solid #f5dfa9"
                    : "none"
                }
                onClick={() => {
                  setShowMessageFrame(false);
                }}
              >
                {t("create")}
              </PageLink>
              <PageLink
                to="collection"
                border={
                  location.pathname === "/collection"
                    ? "1px solid #c4c4c4"
                    : "none"
                }
                onClick={() => {
                  setShowMessageFrame(false);
                }}
              >
                {t("collection_list")}
              </PageLink>
              <PageLink
                to="favoriteList"
                border={
                  location.pathname === "/favoriteList"
                    ? "1px solid #c4c4c4"
                    : "none"
                }
                onClick={() => {
                  setShowMessageFrame(false);
                }}
              >
                {t("favorite_list")}
              </PageLink>
            </>
          )}
        </LeftContainer>
        <RightContainer>
          {isLogin && (
            <>
              <Icon
                img={`url(${friendsIcon})`}
                onClick={() => {
                  navigate("/friendList");
                }}
              >
                {(friendRequests.length !== 0 ||
                  unreadMessages.length !== 0) && (
                  <NotificationDot right="-4px" bottom="2px" />
                )}
              </Icon>
              <Icon
                img={avatar ? `url(${avatar})` : `url(${memberIcon})`}
                borderRadius="18px"
                onClick={() => {
                  setShowMessageFrame(false);
                  navigate("/profile");
                }}
              />
            </>
          )}
          <LanguageContainer ref={languageRef}>
            <Icon
              img={`url(${languageIcon})`}
              onClick={() => setIsShowLanguages((prev) => !prev)}
            >
              <LanguageOptions
                isShowLanguages={isShowLanguages}
                activeLanguageIndex={activeLanguageIndex}
                setActiveLanguageIndex={setActiveLanguageIndex}
              />
            </Icon>
          </LanguageContainer>
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
        <MobileMenuContainer ref={mobileMenuRef}>
          <MenuIcon onClick={() => setIsShowMobileMenu((prev) => !prev)} />
          <MobileContainer
            maxHeight={isShowMobileMenu ? "450px" : "0"}
            ref={mobileLanguageRef}
          >
            <MobileLanguageContext
              onClick={() => setIsShowMobileLanguages((prev) => !prev)}
            >
              {i18t("languages")}
            </MobileLanguageContext>

            <MobileLanguageContainer
              maxHeight={isShowMobileLanguages ? "129px" : "0"}
            >
              <MobileLanguageInnerContainer>
                {languages.map((lng, index) => (
                  <LanguageOptionsText
                    key={`${lng.code}`}
                    $color={
                      activeLanguageIndex === index ? "#ffffff" : "#c4c4c490"
                    }
                    backgroundColor={
                      activeLanguageIndex === index ? "#64646490" : "#646464"
                    }
                    onClick={() => {
                      i18next.changeLanguage(lng.code);
                      setActiveLanguageIndex(index);
                    }}
                  >
                    {lng.name}
                  </LanguageOptionsText>
                ))}
              </MobileLanguageInnerContainer>
            </MobileLanguageContainer>

            {isLogin ? (
              <>
                <MobileContext to="profile">{t("profile")}</MobileContext>
                <MobileContext to="friendList">
                  {t("friend_list")}
                  {(friendRequests.length !== 0 ||
                    unreadMessages.length !== 0) && (
                    <NotificationDot right="15px" bottom="15px" />
                  )}
                </MobileContext>
                <MobileContext
                  to="createNewProject"
                  onClick={() => {
                    setShowMessageFrame(false);
                  }}
                >
                  {t("create")}
                </MobileContext>
                <MobileContext
                  to="collection"
                  onClick={() => {
                    setShowMessageFrame(false);
                  }}
                >
                  {t("collection_list")}
                </MobileContext>
                <MobileContext
                  to="favoriteList"
                  onClick={() => {
                    setShowMessageFrame(false);
                  }}
                >
                  {t("favorite_list")}
                </MobileContext>

                <SignBtn
                  onClick={() => {
                    logoutHandler();
                  }}
                >
                  {t("logout")}
                </SignBtn>
              </>
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
          </MobileContainer>
        </MobileMenuContainer>
      </Container>
    </Wrapper>
  );
}

export default Header;
