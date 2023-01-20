import { Dispatch, SetStateAction } from "react";
import { Timestamp } from "firebase/firestore";

export interface UserDataType {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  introduction: string;
  friendList: string[];
  favoriteList: string[];
  folders: { folderName: string; photos: string[] }[];
}

export interface UserProjectsType {
  uid: string;
  mainUrl: string;
  projectId: string;
  title: string;
  time: number;
  pages: {
    key: string;
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
}

export interface FriendDataType {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  searchName: string;
}
export interface SingleProjectTemplateProps {
  photoUrl: string[];
  content: string[];
}

export interface CreateTemplateProps {
  setPages: Dispatch<
    SetStateAction<
      {
        key: string;
        type: number;
        content?: string[];
        photos?: string[];
        location?: { lat?: number; lng?: number };
      }[]
    >
  >;
  pages: {
    key: string;
    type: number;
    content?: string[];
    photos?: string[];
    location?: { lat?: number; lng?: number };
  }[];
  currentIndex: number;
  position: { lat?: number; lng?: number };
  setPosition: Dispatch<SetStateAction<{ lat?: number; lng?: number }>>;
}

export interface FetchedProjectsType {
  uid: string;
  name?: string;
  avatar?: string;
  mainUrl: string;
  projectId: string;
  introduction?: string;
  title: string;
  time: number;
  pages: {
    key: string;
    type: number;
    content?: string[];
    photos?: string[];
    location?: { lat?: number; lng?: number };
  }[];
}

export interface PagesType {
  key: string;
  type: number;
  content?: string[];
  photos?: string[];
  location?: { lat?: number; lng?: number };
}

export interface FolderType {
  folderName: string;
  photos: string[];
}

export interface TemplateOverlayProps {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  setNewPhotoUrl: (returnedUrl: string) => void;
  currentAaspect: number;
  currentImgUrl: string;
  isAddToCollection: boolean;
  setIsAddToCollection: Dispatch<SetStateAction<boolean>>;
}

export interface SquareOverlayProps {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  mainImgSrc: string;
  setMainImgSrc: Dispatch<SetStateAction<string>>;
  shape?: "rect" | "round" | undefined;
  usage?: string;
}

export interface SearchFriendDataType {
  uid?: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface MessageFriendDtlType {
  friendUid: string;
  name: string;
  avatar: string;
  chatroomId: string;
}

export interface HistoryMessageDataType {
  from?: string;
  message?: string;
  time?: Timestamp;
}

export interface BrickPropsType {
  uid: string;
  projectId: string;
  mainUrl: string;
  avatar: string;
  name: string;
  title: string;
}

export interface LikeIconPropsType {
  projectId: string;
  margin: string;
  width: string;
  height: string;
}

export interface CarouselStoryType {
  name: string;
  quote: string;
  photo: string;
  wikipedia: string;
}

export interface OtherUserDataType {
  uid: string;
  name: string;
  avatar: string;
  email: string;
  introduction: string;
}
