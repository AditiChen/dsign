import {
  useState,
  createContext,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebaseSDK";
import { AuthContext } from "./authContext";

type BodyProp = { children: React.ReactNode };

interface FriendData {
  uid: string;
  name: string;
  email: string;
  avatar: string;
}

interface FriendContextType {
  clickedFriendId: string;
  setClickedFriendId: Dispatch<SetStateAction<string>>;
  friendDataList: FriendData[];
  setFriendDataList: Dispatch<SetStateAction<FriendData[]>>;
  friendRequests: FriendData[];
  setFriendRequests: Dispatch<SetStateAction<FriendData[]>>;
}

export const FriendContext = createContext<FriendContextType>({
  clickedFriendId: "",
  setClickedFriendId: () => {},
  friendDataList: [],
  setFriendDataList: () => {},
  friendRequests: [],
  setFriendRequests: () => {},
});

export function FriendContextProvider({ children }: BodyProp) {
  const { userId, friendList } = useContext(AuthContext);
  const [clickedFriendId, setClickedFriendId] = useState("");
  const [friendRequests, setFriendRequests] = useState<FriendData[]>([]);
  const [friendDataList, setFriendDataList] = useState<FriendData[]>([]);
  console.log("friendDataList", friendDataList);
  useEffect(() => {
    setFriendRequests([]);
    const q = query(collection(db, "friendRequest"), where("to", "==", userId));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const userIds: string[] = [];
      querySnapshot.forEach((returnedDoc) => {
        userIds.push(returnedDoc.data().from);
      });
      const result = userIds.map(async (id) => {
        const docSnap = await getDoc(doc(db, "users", id));
        const data = docSnap.data() as FriendData;
        return data;
      });
      const newResult = await Promise.all(result);
      setFriendRequests(newResult);
    });
    return () => {
      unsubscribe();
    };
  }, [userId]);

  useEffect(() => {
    if (friendList.length === 0) return;
    setFriendDataList([]);
    const q = query(collection(db, "friendRequest"), where("to", "==", userId));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const result = friendList.map(async (id) => {
        const docSnap = await getDoc(doc(db, "users", id));
        const data = docSnap.data() as FriendData;
        return data;
      });
      const newResult = await Promise.all(result);
      setFriendDataList(newResult);
    });
  }, [friendList]);

  const authProviderValue = useMemo(
    () => ({
      friendDataList,
      clickedFriendId,
      setClickedFriendId,
      setFriendDataList,
      friendRequests,
      setFriendRequests,
    }),
    [
      friendDataList,
      clickedFriendId,
      setClickedFriendId,
      setFriendDataList,
      friendRequests,
      setFriendRequests,
    ]
  );

  return (
    <FriendContext.Provider value={authProviderValue}>
      {children}
    </FriendContext.Provider>
  );
}
