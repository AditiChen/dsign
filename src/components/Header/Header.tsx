import i18next, { t as i18t } from "i18next";
import { useTranslation } from "react-i18next";
import { useState, useContext, useRef, Dispatch, SetStateAction } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import useOnClickOutside from "../../utils/useOnClickOutside";
import { languageIcon, memberIcon, friendsIcon } from "../icons/icons";
import {
  Wrapper,
  Container,
  LeftContainer,
  Logo,
  PageLink,
  RightContainer,
  LanguageOptionsContainer,
  LanguageContainer,
  Icon,
  NotificationDot,
  LanguageHeader,
  LanguageOptionsText,
  SignBtn,
  MobileMenuContainer,
  MenuIcon,
  MobileContainer,
  MobileLanguageContext,
  MobileLanguageContainer,
  MobileLanguageInnerContainer,
  MobileContext,
} from "../StyledComponents/HeaderStyledComponents";

const languages = [
  { code: "en", name: "English", country_code: "GB" },
  { code: "fr", name: "Français", country_code: "FR" },
  { code: "zh", name: "中文", country_code: "TW" },
  { code: "ja", name: "日本語", country_code: "JP" },
];

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
