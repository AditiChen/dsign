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
import { FriendDataType } from "../components/tsTypes";

type BodyProp = { children: React.ReactNode };

interface FriendContextType {
  friendDataList: FriendDataType[];
  setFriendDataList: Dispatch<SetStateAction<FriendDataType[]>>;
  friendRequests: FriendDataType[];
  setFriendRequests: Dispatch<SetStateAction<FriendDataType[]>>;
  showMessageFrame: boolean;
  setShowMessageFrame: Dispatch<SetStateAction<boolean>>;
  unreadMessages: { chatroomId: string; friendId: string }[];
}

export const FriendContext = createContext<FriendContextType>({
  friendDataList: [],
  setFriendDataList: () => {},
  friendRequests: [],
  setFriendRequests: () => {},
  showMessageFrame: false,
  setShowMessageFrame: () => {},
  unreadMessages: [],
});

export function FriendContextProvider({ children }: BodyProp) {
  const { userId, friendList } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState<FriendDataType[]>([]);
  const [friendDataList, setFriendDataList] = useState<FriendDataType[]>([]);
  const [showMessageFrame, setShowMessageFrame] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<
    { chatroomId: string; friendId: string }[]
  >([]);

  useEffect(() => {
    if (userId === "") return undefined;
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
        const data = docSnap.data() as FriendDataType;
        return data;
      });
      const newResult = await Promise.all(result);
      setFriendRequests(newResult);
    });
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (userId === "") return undefined;
    const unsub = onSnapshot(doc(db, "users", userId), async () => {
      const result = friendList?.map(async (id: string) => {
        const docSnap = await getDoc(doc(db, "users", id));
        const data = docSnap.data() as FriendDataType;
        return data;
      });
      const newResult = await Promise.all(result);
      setFriendDataList(newResult);
    });
    return () => {
      unsub();
    };
  }, [userId, friendList]);

  useEffect(() => {
    if (userId === "") return undefined;
    const queryUnread = query(
      collection(db, "chatrooms"),
      where("unread", "==", userId)
    );
    const unsubscribe = onSnapshot(queryUnread, async (querySnapshot) => {
      const chatRoomDtl: { chatroomId: string; friendId: string }[] = [];
      querySnapshot.forEach((responseDoc) => {
        const friendId = responseDoc
          .data()
          .owners.find((id: string) => id !== userId);
        const returnedData = {
          chatroomId: responseDoc.id,
          friendId,
        };
        chatRoomDtl.push(returnedData);
      });
      setUnreadMessages(chatRoomDtl);
    });
    return () => {
      unsubscribe();
    };
  }, [userId, friendList]);

  const authProviderValue = useMemo(
    () => ({
      friendDataList,
      setFriendDataList,
      friendRequests,
      setFriendRequests,
      showMessageFrame,
      setShowMessageFrame,
      unreadMessages,
    }),
    [
      friendDataList,
      setFriendDataList,
      friendRequests,
      setFriendRequests,
      showMessageFrame,
      setShowMessageFrame,
      unreadMessages,
    ]
  );

  return (
    <FriendContext.Provider value={authProviderValue}>
      {children}
    </FriendContext.Provider>
  );
}
