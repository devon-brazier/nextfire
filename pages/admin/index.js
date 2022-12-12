import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import MetaTags from "../../components/Metatags";
import { auth, firestore } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from "lodash.kebabcase";
import { toast } from "react-hot-toast";
import PostFeed from "../../components/PostFeed";

export default function AdminPostsPage({}) {
    return (
        <main>
            <AuthCheck>
                <MetaTags title="admin page" />
                <PostList />
                <CreateNewPost />
            </AuthCheck>
 
        </main>
    )
}

function PostList() {
    const usersRef = collection(firestore, "users");
    const userRef = doc(usersRef, auth.currentUser.uid);
    const postsRef = collection(userRef, "posts");

    const q = query(postsRef, orderBy("createdAt"));

    const [querySnapshot] = useCollection(q);

    // useCollectionData hook, which will give data from query so dont need this line
    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
}

function CreateNewPost() {
    const router = useRouter();

    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const usersRef = collection(firestore, "users");
        const userRef = doc(usersRef, uid);
        const postsRef = collection(userRef, "posts");
        const newPostref = doc(postsRef, slug);

        // Tip: give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: "# hello world!",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(newPostref, data);

        toast.success("Post created!");

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }   

    return (
        <form onSubmit={createPost}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Article!"
                className={styles.input}
            />
            <p>
                <strong>Slug:</strong> {slug}
            </p>
            <button type="submit" disabled={!isValid} className="btn-green">
                Create New Post
            </button>
        </form>
    );
}