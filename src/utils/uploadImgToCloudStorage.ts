import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";

import { storage } from "../context/firebaseSDK";

export default async function uploadImgToCloudStorage(
  file: File,
  userId: string,
  fileId: string
) {
  return new Promise((resolve) => {
    let newUrl: string = "";
    const imgRef = ref(storage, `images/${userId}/${fileId}`);
    const uploadTask = uploadBytesResumable(imgRef, file);
    uploadTask.on(
      "state_changed",
      () => {},
      () => {
        Swal.fire({
          text: "Upload failed, please try again later",
          icon: "warning",
          confirmButtonColor: "#646464",
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        newUrl = downloadURL;
        resolve(newUrl);
      }
    );
  });
}
