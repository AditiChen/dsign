import { Dispatch, SetStateAction } from "react";

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
