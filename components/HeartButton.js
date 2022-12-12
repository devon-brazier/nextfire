import { firestore, auth } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, writeBatch, increment } from "firebase/firestore";

// Allows user to heart or like a post
export default function HeartButton({ postRef }) {
    // Listen to heart document for currently logged in user
    const heartsRef = doc(postRef, "hearts", auth.currentUser.uid);
    const [heartDoc] = useDocument(heartsRef);

    // Create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartsRef, { uid });

        await batch.commit();
    };

    // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartsRef);

        await batch.commit();
    };

    return heartDoc?.exists() ? (
        <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
        <button onClick={addHeart}>❤️ Heart</button>
    );

}