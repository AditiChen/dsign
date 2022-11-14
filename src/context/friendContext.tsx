import {
  useState,
  createContext,
  useEffect,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebaseSDK";
import { AuthContext } from "./authContext";

type BodyProp = { children: React.ReactNode };

interface FriendData {
  uid: string;
  name: string;
  email: string;
  avatar: string;
}

interface FriendContextType {
  clickedUserId: string;
  setClickedUserId: Dispatch<SetStateAction<string>>;
  friendDataList: FriendData[];
  setFriendDataList: Dispatch<SetStateAction<FriendData[]>>;
  friendRequests: FriendData[];
  setFriendRequests: Dispatch<SetStateAction<FriendData[]>>;
  showMessageFrame: boolean;
  setShowMessageFrame: Dispatch<SetStateAction<boolean>>;
}

export const FriendContext = createContext<FriendContextType>({
  clickedUserId: "",
  setClickedUserId: () => {},
  friendDataList: [],
  setFriendDataList: () => {},
  friendRequests: [],
  setFriendRequests: () => {},
  showMessageFrame: false,
  setShowMessageFrame: () => {},
});

export function FriendContextProvider({ children }: BodyProp) {
  const { userId, friendList } = useContext(AuthContext);
  const [clickedUserId, setClickedUserId] = useState("");
  const [friendRequests, setFriendRequests] = useState<FriendData[]>([]);
  const [friendDataList, setFriendDataList] = useState<FriendData[]>([]);
  const [showMessageFrame, setShowMessageFrame] = useState(false);

  useEffect(() => {
    if (userId === "") return undefined;
    setFriendRequests([]);
    const q = query(
      collection(db, "friendRequests"),
      where("to", "==", userId)
    );
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
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (userId === "") return undefined;
    setFriendDataList([]);
    const unsub = onSnapshot(doc(db, "users", userId), async (returnedDoc) => {
      const result = friendList?.map(async (id: string) => {
        const docSnap = await getDoc(doc(db, "users", id));
        const data = docSnap.data() as FriendData;
        return data;
      });
      const newResult = await Promise.all(result);
      setFriendDataList(newResult);
    });
    return () => {
      unsub();
    };
  }, [userId, friendList]);

  const authProviderValue = useMemo(
    () => ({
      friendDataList,
      setFriendDataList,
      clickedUserId,
      setClickedUserId,
      friendRequests,
      setFriendRequests,
      showMessageFrame,
      setShowMessageFrame,
    }),
    [
      friendDataList,
      setFriendDataList,
      clickedUserId,
      setClickedUserId,
      friendRequests,
      setFriendRequests,
      showMessageFrame,
      setShowMessageFrame,
    ]
  );

  return (
    <FriendContext.Provider value={authProviderValue}>
      {children}
    </FriendContext.Provider>
  );
}
