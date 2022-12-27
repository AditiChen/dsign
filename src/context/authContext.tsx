import {
  useState,
  createContext,
  useEffect,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { useTranslation } from "react-i18next";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { db, auth } from "./firebaseSDK";
import setNewUserDoc from "../utils/setNewUserDoc";
import getUserProjects from "../utils/getUserProjects";
import { UserDataType, UserProjectsType } from "../components/tsTypes";

type BodyProp = { children: React.ReactNode };

interface AuthContextType {
  isLogin: boolean;
  isLoading: boolean;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  introduction: string;
  friendList: string[];
  setFriendList: Dispatch<SetStateAction<string[]>>;
  favoriteList: string[];
  setFavoriteList: Dispatch<SetStateAction<string[]>>;
  userProjects: UserProjectsType[];
  setUserProjects: Dispatch<SetStateAction<UserProjectsType[]>>;
  folders: { folderName: string; photos: string[] }[];
  setFolders: Dispatch<
    SetStateAction<{ folderName: string; photos: string[] }[]>
  >;
  emailSignInHandler(email: string, password: string): void;
  signUp(email: string, password: string, name: string): void;
  googleLoginHandler(): void;
  facebookLoginHandler(): void;
  logout(): void;
}

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  isLoading: false,
  userId: "",
  name: "",
  email: "",
  avatar: "",
  introduction: "",
  friendList: [],
  setFriendList: () => {},
  favoriteList: [],
  setFavoriteList: () => {},
  userProjects: [],
  setUserProjects: () => {},
  folders: [],
  setFolders: () => {},
  emailSignInHandler: () => {},
  signUp: () => {},
  googleLoginHandler: () => {},
  facebookLoginHandler: () => {},
  logout: () => {},
});

export function AuthContextProvider({ children }: BodyProp) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [friendList, setFriendList] = useState<string[]>([]);
  const [favoriteList, setFavoriteList] = useState<string[]>([]);
  const [folders, setFolders] = useState<
    { folderName: string; photos: string[] }[]
  >([]);
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { uid } = user;
        const docSnap = await getDoc(doc(db, "users", uid));
        const data = docSnap.data() as UserDataType;
        setUserId(uid);
        setAvatar(data.avatar);
        setName(data.name);
        setEmail(data.email);
        setIntroduction(data.introduction);
        setFriendList(data.friendList);
        setFavoriteList(data.favoriteList);
        setFolders(data.folders);
        setIsLogin(true);
        const userProjectsData = await getUserProjects(uid);
        setUserProjects(userProjectsData);
      } else {
        setIsLogin(false);
      }
    });
    setIsLoading(false);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId === "") return undefined;
    const unsub = onSnapshot(doc(db, "users", userId), async (returnedDoc) => {
      const data = returnedDoc.data() as UserDataType;
      setAvatar(data.avatar);
      setName(data.name);
      setEmail(data.email);
      setIntroduction(data.introduction);
      setFriendList(data.friendList);
      setFavoriteList(data.favoriteList);
      setFolders(data.folders);
      setIsLogin(true);
    });
    return () => {
      unsub();
    };
  }, [userId]);

  const emailSignInHandler = useCallback(
    async (insertEmail: string, password: string) => {
      setIsLoading(true);
      try {
        const UserCredentialImpl = await signInWithEmailAndPassword(
          auth,
          insertEmail,
          password
        );
        const { user } = UserCredentialImpl;
        const { uid } = user;
        setUserId(uid);
        const userProjectsData = await getUserProjects(uid);
        Swal.fire({
          text: t("login_successfully"),
          confirmButtonColor: "#646464",
        });
        setUserProjects(userProjectsData);
        navigate("/");
      } catch (e) {
        Swal.fire({
          text: t("login_failed"),
          icon: "warning",
          confirmButtonColor: "#646464",
        });
      }
      setIsLoading(false);
    },
    [navigate, t]
  );

  const signUp = useCallback(
    async (insertEmail: string, password: string, insertName: string) => {
      setIsLoading(true);
      try {
        const UserCredentialImpl = await createUserWithEmailAndPassword(
          auth,
          insertEmail,
          password
        );
        const { uid } = UserCredentialImpl.user;
        const photoURL = `https://source.boringavatars.com/marble/180/${uid}`;
        await setNewUserDoc(uid, insertName, insertEmail, photoURL);
        setUserId(uid);
        setIsLogin(true);
        Swal.fire({
          text: t("sign_up_successfully"),
          confirmButtonColor: "#646464",
        });
        navigate("/");
      } catch (e) {
        Swal.fire({
          text: t("sign_up_failed"),
          icon: "warning",
          confirmButtonColor: "#646464",
        });
        navigate("/login");
      }
      setIsLoading(false);
    },
    [navigate, t]
  );

  const googleLoginHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { uid, photoURL, displayName } = result.user;
      const docSnap = await getDoc(doc(db, "users", uid));
      const data = docSnap.data() as UserDataType;
      if (data === undefined && displayName !== null && photoURL !== null) {
        const gmail = result.user.email as string;
        await setNewUserDoc(uid, displayName, gmail, photoURL);
      }
      setUserId(uid);
      setIsLogin(true);
      const userProjectsData = await getUserProjects(uid);
      setUserProjects(userProjectsData);
      navigate("/");
    } catch (e) {
      Swal.fire({
        text: t("sign_up_failed"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate, t]);

  const facebookLoginHandler = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { uid, photoURL, displayName } = result.user;
      const docSnap = await getDoc(doc(db, "users", uid));
      const data = docSnap.data() as UserDataType;
      if (data === undefined && displayName !== null && photoURL !== null) {
        const fbMail = result.user.email as string;
        await setNewUserDoc(uid, displayName, fbMail, photoURL);
      }
      setUserId(uid);
      setIsLogin(true);
      const userProjectsData = await getUserProjects(uid);
      setUserProjects(userProjectsData);
      navigate("/");
    } catch (e) {
      Swal.fire({
        text: t("sign_up_failed"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate, t]);

  const logout = useCallback(() => {
    signOut(auth);
    setName("");
    setUserId("");
    setEmail("");
    setAvatar("");
    setUserProjects([]);
    setFriendList([]);
    setFavoriteList([]);
    setIsLogin(false);
    window.sessionStorage.removeItem("pages");
    window.sessionStorage.removeItem("title");
    window.sessionStorage.removeItem("mainImg");
    Swal.fire({
      text: t("logout_successfully"),
      confirmButtonColor: "#646464",
    });
  }, [t]);

  const authProviderValue = useMemo(
    () => ({
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      introduction,
      friendList,
      setFriendList,
      favoriteList,
      setFavoriteList,
      folders,
      setFolders,
      signUp,
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
      userProjects,
      setUserProjects,
    }),
    [
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      introduction,
      friendList,
      setFriendList,
      favoriteList,
      setFavoriteList,
      folders,
      setFolders,
      signUp,
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
      userProjects,
      setUserProjects,
    ]
  );

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
}
