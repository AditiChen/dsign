import { useState, createContext, useEffect, useMemo } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
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
  emailSignInHandler: () => {},
  signUp: () => {},
  googleLoginHandler: () => {},
  facebookLoginHandler: () => {},
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
        setAvatar(data.avatar);
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

  const emailSignInHandler = async (insertEmail: string, password: string) => {
    setIsLoading(true);
    try {
      const UserCredentialImpl = await signInWithEmailAndPassword(
        auth,
        insertEmail,
        password
      );
      alert("login successfully!");
      const { user }: any = UserCredentialImpl;
      const { uid } = user;
      const userEmail = user.reloadUserInfo.email;
      const docSnap = await getDoc(doc(db, "users", uid));
      const data: any = docSnap.data();
      setAvatar(data.avatar);
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
        uid,
        name: insertName,
        email: insertEmail,
        avatar: `https://source.boringavatars.com/marble/180/${newName}`,
      });
      setUserId(uid);
      setEmail(userEmail);
      setName(insertName);
      setAvatar(`https://source.boringavatars.com/marble/180/${newName}`);
      setIsLogin(true);
    } catch (e) {
      alert("failed to sign up,please check your information and try again!");
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
    });
    if (!gmail || !photoURL || !displayName) return;
    setUserId(uid);
    setEmail(gmail);
    setName(displayName);
    setAvatar(photoURL);
    setIsLogin(true);
    setIsLoading(false);
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
    });
    if (!fbMmail || !photoURL || !displayName) return;
    setUserId(uid);
    setName(displayName);
    setEmail(fbMmail);
    setAvatar(photoURL);
    setIsLogin(true);
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
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
    }),
    [
      isLogin,
      isLoading,
      userId,
      name,
      email,
      avatar,
      signUp,
      emailSignInHandler,
      googleLoginHandler,
      facebookLoginHandler,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
}
