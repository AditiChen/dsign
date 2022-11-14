import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../context/firebaseSDK";

export default async function upLoadImgToCloudStorage(
  file: File,
  userId: string,
  fileId: string
) {
  return new Promise((resolve, reject) => {
    let newUrl: string = "";
    const imgRef = ref(storage, `images/${userId}/${fileId}`);
    const uploadTask = uploadBytesResumable(imgRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {},
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        newUrl = downloadURL;
        resolve(newUrl);
      }
    );
  });
}
