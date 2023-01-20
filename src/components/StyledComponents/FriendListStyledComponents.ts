import styled from "styled-components";
import ReactLoading from "react-loading";
import {
  searchIcon,
  openMessageIcon,
  openMessageIconHover,
  deleteFriendIcon,
  deleteFriendIconHover,
} from "../icons/icons";

export const Wrapper = styled.div`
  padding: 30px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  position: relative;
  display: flex;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    padding: 20px 0;
  }
  @media screen and (max-width: 799px) {
    padding: 10px 0;
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1499px) {
    width: 1000px;
  }
`;

export const Separator = styled.div`
  position: relative;
  margin: 20px auto 0;
  width: 70%;
  max-width: 800px;
  @media screen and (max-width: 799px) {
    width: 80%;
  }
  @media screen and (max-width: 499px) {
    margin-top: 10px;
    width: 90%;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  height: 40px;
  width: 100%;
  border-radius: 20px;
  padding: 5px 45px 5px 20px;
  border: solid 1px #d4d4d4;
  font-size: 18px;
  line-height: 30px;
  background-color: #f0f0f090;
  &:focus {
    outline: none;
    background-color: #3c3c3c20;
  }
  &::placeholder {
    color: #b4b4b4;
  }
  @media screen and (max-width: 799px) {
    height: 35px;
    font-size: 12px;
    padding: 5px 35px 5px 10px;
  }
`;

export const SearchIcon = styled.div`
  height: 26px;
  width: 26px;
  position: absolute;
  right: 15px;
  background-image: url(${searchIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 799px) {
    height: 22px;
    width: 22px;
    right: 10px;
  }
`;

export const SwitchClickStatusContainer = styled.div`
  height: 40px;
  display: flex;
`;

export const SwitchClickStatusBtn = styled.div<{
  color: string;
  border: string;
}>`
  margin: 5px 0;
  color: ${(props) => props.color};
  font-size: 22px;
  font-weight: 600;
  line-height: 30px;
  border-bottom: ${(props) => props.border};
  position: relative;
  &:hover {
    cursor: pointer;
    color: #3c3c3c;
  }
  & + & {
    margin-left: 30px;
  }
  @media screen and (max-width: 1449px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    font-size: 16px;
    & + & {
      margin-left: 10px;
    }
  }
`;

export const NotificationDot = styled.div<{ top?: string; right?: string }>`
  height: 10px;
  width: 10px;
  position: absolute;
  top: ${(props) => props.top};
  right: ${(props) => props.right};
  border-radius: 50%;
  background-image: linear-gradient(#89b07e, #4f8365);
`;

export const FriendListContainer = styled.div`
  padding: 20px 30px;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f0f0f090;
  &:hover {
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
  @media screen and (max-width: 799px) {
    padding: 10px;
  }
`;

export const Avatar = styled.div<{ url?: string }>`
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  border: 1px solid #f0f0f0;
  &:hover {
    cursor: pointer;
    border: 1px solid #d4d4d4;
    box-shadow: 1px 1px 3px #3c3c3c50;
  }
  @media screen and (max-width: 799px) {
    height: 60px;
    width: 60px;
  }
`;

export const TextContainer = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 799px) {
    margin-left: 10px;
  }
`;

export const Text = styled.div<{
  $color?: string;
  $size?: string;
  mobileSize?: string;
}>`
  margin-bottom: 5px;
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$size};
  background-color: #f0f0f000;
  @media screen and (max-width: 799px) {
    font-size: ${(props) => props.mobileSize};
  }
`;

export const MessageIcon = styled.div`
  margin-top: 5px;
  width: 30px;
  height: 30px;
  background-image: url(${openMessageIcon});
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover {
    cursor: pointer;
    background-image: url(${openMessageIconHover});
  }
  @media screen and (max-width: 799px) {
    margin-top: 0;
    height: 22px;
    width: 22px;
  }
`;

export const BtnContainer = styled.div`
  margin-left: auto;
  display: flex;
  @media screen and (max-width: 799px) {
    flex-direction: column;
  }
`;

export const SendRequestBtn = styled.button`
  padding: 0 10px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
  & + & {
    margin-left: 10px;
  }
  @media screen and (max-width: 799px) {
    padding: 0 5px;
    width: 60px;
    height: 30px;
    font-size: 12px;
    border-radius: 5px;
    & + & {
      margin-left: 0;
      margin-top: 5px;
    }
  }
`;

export const DeleteIcon = styled.div`
  height: 30px;
  width: 30px;
  background-image: url(${deleteFriendIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${deleteFriendIconHover});
  }
  @media screen and (max-width: 799px) {
    height: 24px;
    width: 24px;
  }
`;

export const Loading = styled(ReactLoading)`
  margin: 0 auto;
`;
