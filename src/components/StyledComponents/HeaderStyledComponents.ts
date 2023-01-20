import styled from "styled-components";
import { Link } from "react-router-dom";

import { logoIcon, menuIcon } from "../icons/icons";

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

export const Wrapper = styled.div`
  width: 100vw;
  height: 60px;
  color: #c4c4c4;
  position: relative;
  z-index: 10;
  @media screen and (max-width: 949px) {
    height: 50px;
  }
`;

export const Container = styled.div`
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

export const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Logo = styled(Link)`
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

export const PageLink = styled(Link)`
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

export const RightContainer = styled.div`
  display: flex;
  @media screen and (max-width: 799px) {
    display: none;
  }
`;

export const LanguageOptionsContainer = styled.div`
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

export const LanguageContainer = styled.div`
  margin-left: 28px;
  position: relative;
  @media screen and (min-width: 800px) and (max-width: 949px) {
    margin-left: 20px;
  }
`;

export const Icon = styled.div`
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

export const NotificationDot = styled.div`
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

export const LanguageHeader = styled.div`
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

export const LanguageOptionsText = styled.div`
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

export const SignBtn = styled.button`
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

export const MobileMenuContainer = styled.div`
  margin-right: 10px;
  display: none;
  position: fixed;
  right: 10px;
  @media screen and (max-width: 799px) {
    display: block;
  }
`;

export const MenuIcon = styled.div`
  height: 26px;
  width: 26px;
  background-image: url(${menuIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

export const MobileContainer = styled.div`
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

export const MobileLanguageContext = styled.div`
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

export const MobileLanguageContainer = styled.div`
  max-height: ${(props: Prop) => props.maxHeight};
  overflow: hidden;
  transition: max-height 0.3s ease-in;
`;

export const MobileLanguageInnerContainer = styled.div`
  height: 129px;
`;

export const MobileContext = styled(Link)`
  padding: 15px 10px;
  width: 100%;
  height: 45px;
  color: #c4c4c4;
  font-size: 14px;
  text-decoration: none;
  position: relative;
  border-bottom: 1px solid #c4c4c4;
`;
