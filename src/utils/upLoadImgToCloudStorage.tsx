import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../context/firebaseSDK";

export default function upLoadImgToCloudStorage(file: File) {
  let newUrl;
  const urlByUuid = uuid();
  const imgRef = ref(storage, `images/${urlByUuid}`);
  const uploadTask = uploadBytesResumable(imgRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      console.log("Upload err", error);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      newUrl = downloadURL;
      return downloadURL;
    }
  );

  return newUrl;
}
