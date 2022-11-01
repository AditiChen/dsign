// import { useTranslation } from "react-i18next";
import i18next, { t } from "i18next";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import language from "./language-icon.png";
import logo from "./Logo.png";

interface Prop {
  img?: string;
  size?: string;
  borderBtm?: string;
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
  position: fixed;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
`;

const Logo = styled(Link)`
  width: 155px;
  height: 45px;
  background-image: url(${logo});
`;

const RightContainer = styled.div`
  display: flex;
`;

const Icon = styled.div`
  height: 35px;
  width: 35px;
  position: relative;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  & + & {
    margin-left: 20px;
  }
`;

const LanguageOptionsContainer = styled.div`
  width: 110px;
  padding: 10px;
  position: absolute;
  top: 37px;
  right: 0;
  border: 1px solid #787878;
  background-color: white;
  z-index: 1;
`;

const Language = styled.div`
  font-size: ${(props: Prop) => props.size};
  color: #3c3c3c;
  border-bottom: ${(props: Prop) => props.borderBtm};
  text-align: center;
  & + & {
    margin-top: 16px;
  }
`;

function LanguageOptions() {
  return (
    <LanguageOptionsContainer>
      <Language size="16px" borderBtm="1px solid #3c3c3c">
        {t("languages")}
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
    </LanguageOptionsContainer>
  );
}

function Header() {
  const [showLanghages, setShowLanguages] = useState(false);
  return (
    <Wrapper>
      <LeftContainer>
        <Logo to="profile" />
      </LeftContainer>
      <RightContainer>
        <Icon
          img={`url(${language})`}
          onClick={() => {
            setShowLanguages((prev) => !prev);
          }}
        >
          {showLanghages ? <LanguageOptions /> : ""}
        </Icon>
      </RightContainer>
    </Wrapper>
  );
}

export default Header;
