import {
  useState,
  createContext,
  useEffect,
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
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebaseSDK";
import getProjects from "../utils/getProjects";

type BodyProp = { children: React.ReactNode };

interface UserDataType {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  friendList: string[];
  favoriteList: string[];
}
interface UserProjectsType {
  uid: string;
  mainUrl: string;
  projectId: string;
  title: string;
  time: number;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
}

interface AuthContextType {
  isLogin: boolean;
  isLoading: boolean;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  friendList: string[];
  setFriendList: Dispatch<SetStateAction<string[]>>;
  favoriteList: string[];
  setFavoriteList: Dispatch<SetStateAction<string[]>>;
  singleProjectId: string;
  setSingleProjectId: Dispatch<SetStateAction<string>>;
  userProjects: UserProjectsType[];
  setUserProjects: Dispatch<SetStateAction<UserProjectsType[]>>;
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
  friendList: [],
  setFriendList: () => {},
  favoriteList: [],
  setFavoriteList: () => {},
  userProjects: [],
  setUserProjects: () => {},
  singleProjectId: "",
  setSingleProjectId: () => {},
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
  const [friendList, setFriendList] = useState<string[]>([]);
  const [favoriteList, setFavoriteList] = useState<string[]>([]);
  const [singleProjectId, setSingleProjectId] = useState("");
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const { uid } = user;
        const docSnap = await getDoc(doc(db, "users", uid));
        const data = docSnap.data() as UserDataType;
        setUserId(uid);
        setAvatar(data.avatar);
        setName(data.name);
        setEmail(data.email);
        setIsLogin(true);
        setFriendList(data.friendList);
        setFavoriteList(data.favoriteList);
        const userProjectsData = await getProjects(uid);
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
      setIsLogin(true);
      setFriendList(data.friendList);
      setFavoriteList(data.favoriteList);
    });
    return () => {
      unsub();
    };
  }, [userId]);

  const emailSignInHandler = async (insertEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const UserCredentialImpl = await signInWithEmailAndPassword(
        auth,
        insertEmail,
        password
      );
      const { user }: any = UserCredentialImpl;
      const { uid } = user;
      const userEmail = user.reloadUserInfo.email;
      const docSnap = await getDoc(doc(db, "users", uid));
      const data = docSnap.data() as {
        uid: string;
        name: string;
        avatar: string;
        email: string;
        friendList: string[];
        favoriteList: string[];
      };

      setUserId(uid);

      const userProjectsData = await getProjects(uid);
      alert(t("login_successfully"));
      setUserProjects(userProjectsData);
      navigate("/profile");
    } catch (e) {
      alert(t("login_failed"));
      console.log(e);
    }
    setIsLoading(false);
  };

  const signUp = async (
    insertEmail: string,
    password: string,
    insertName: string
  ) => {
    setIsLoading(true);
    try {
      const UserCredentialImpl = await createUserWithEmailAndPassword(
        auth,
        insertEmail,
        password
      );
      const { user }: any = UserCredentialImpl;
      const { uid } = user;
      const newName = insertName.replace(/\s/g, "");
      await setDoc(doc(db, "users", uid), {
        uid,
        name: insertName,
        email: insertEmail,
        avatar: `https://source.boringavatars.com/marble/180/${newName}`,
        friendList: [],
        favoriteList: [],
      });
      setUserId(uid);
      setIsLogin(true);
      alert(t("sign_up_successfully"));
      navigate("/profile");
    } catch (e) {
      alert(t("sign_up_failed"));
      console.log(e);
    }
    setIsLoading(false);
  };

  const googleLoginHandler = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const { uid, photoURL, displayName } = result.user;
    const gmail = result.user.email;
    await setDoc(doc(db, "users", uid), {
      uid,
      name: displayName,
      email: gmail,
      avatar: photoURL,
      friendList: [],
      favoriteList: [],
    });
    if (!gmail || !photoURL || !displayName) return;
    setUserId(uid);
    setIsLogin(true);
    setIsLoading(false);
    const userProjectsData = await getProjects(uid);
    setUserProjects(userProjectsData);
    navigate("/profile");
  };

  const facebookLoginHandler = async () => {
    setIsLoading(true);
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const { uid, photoURL, displayName } = result.user;
    const fbMmail = result.user.email;
    await setDoc(doc(db, "users", uid), {
      uid,
      name: displayName,
      email: fbMmail,
      avatar: photoURL,
      friendList: [],
      favoriteList: [],
    });
    if (!fbMmail || !photoURL || !displayName) return;
    setUserId(uid);
    setIsLogin(true);
    setIsLoading(false);
    const userProjectsData = await getProjects(uid);
    setUserProjects(userProjectsData);
    navigate("/profile");
  };

  const logout = () => {
    signOut(auth);
    setName("");
    setUserId("");
    setEmail("");
    setAvatar("");
    setUserProjects([]);
    setIsLogin(false);
    alert(t("logout_successfully"));
  };

  const authProviderValue = useMemo(
    () => ({
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      friendList,
      setFriendList,
      favoriteList,
      setFavoriteList,
      signUp,
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
      userProjects,
      setUserProjects,
      singleProjectId,
      setSingleProjectId,
    }),
    [
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      friendList,
      setFriendList,
      favoriteList,
      setFavoriteList,
      signUp,
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
      userProjects,
      setUserProjects,
      singleProjectId,
      setSingleProjectId,
    ]
  );

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
}
