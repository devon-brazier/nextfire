import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader({}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    // Creates a Firebase Upload Task
    const uploadFile = async (e) => {
        // Get the file
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split("/")[1];
        console.log("hello")

        // Makes a reference to the storage bucket location
        const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed", 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
                setProgress(progress);
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setDownloadURL(downloadURL);
                    setUploading(false);
                });
            }
        );
    }

    
    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <>
                    <label className="btn">
                        📷 Upload Img
                        <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                    </label>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
        </div>

    );
}