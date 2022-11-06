import {
  useState,
  createContext,
  useEffect,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebaseSDK";

type BodyProp = { children: React.ReactNode };
interface AuthContextType {
  isLogin: boolean;
  isLoading: boolean;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  signIn(email: string, password: string): void;
  signUp(email: string, password: string, name: string): void;
  logout(): void;
}

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  isLoading: false,
  userId: "",
  name: "",
  email: "",
  avatar: "",
  signIn: () => {},
  signUp: () => {},
  logout: () => {},
});

export function AuthContextProvider({ children }: BodyProp) {
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      if (user) {
        const { uid } = user;
        const userEmail = user.email;
        const docSnap = await getDoc(doc(db, "users", uid));
        const data: any = docSnap.data();
        setAvatar(data.photoURL);
        setName(data.name);
        setUserId(uid);
        setEmail(userEmail);
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
    setIsLoading(false);
    return () => unsubscribe();
  }, []);

  const signIn = async (insertEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const UserCredentialImpl = await signInWithEmailAndPassword(
        auth,
        insertEmail,
        password
      );
      alert("sign in successfully!");

      const { user }: any = UserCredentialImpl;
      const { uid } = user;
      const userEmail = user.reloadUserInfo.email;
      const docSnap = await getDoc(doc(db, "users", uid));
      const data: any = docSnap.data();
      setAvatar(data.photoURL);
      setName(data.name);
      setUserId(uid);
      setEmail(userEmail);
      setIsLogin(true);
    } catch (e) {
      alert("failed to sign in,please check your information and try again!");
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
      alert("sign up successfully!");
      const { user }: any = UserCredentialImpl;
      const { uid } = user;
      const userEmail = user.reloadUserInfo.email;
      const newName = name.replace(/\s/g, "");
      await setDoc(doc(db, "users", uid), {
        id: uid,
        name: insertName,
        email: insertEmail,
        photoURL: `https://source.boringavatars.com/marble/180/${newName}`,
      });
      setUserId(uid);
      setEmail(userEmail);
      setAvatar(`https://source.boringavatars.com/marble/180/${newName}`);
      setIsLogin(true);
    } catch (e) {
      alert("failed to sign up,please check your information and try again!");
      console.log(e);
    }
    setIsLoading(false);
  };

  const logout = () => {
    signOut(auth);
    setName("");
    setUserId("");
    setEmail("");
    setAvatar("");
    setIsLogin(false);
    alert("Logout successfully!");
  };
  const authProviderValue = useMemo(
    () => ({
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      signUp,
      signIn,
      logout,
    }),
    [isLogin, isLoading, userId, name, email, avatar, signUp, signIn, logout]
  );

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
}
