import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";

// https://nextjs.org/docs/api-reference/data-fetching/get-server-side-props#context-parameter
export async function getServerSideProps({ params }) {
    const { username } = params;

    const userDoc = await getUserWithUsername(username);

    // If no user, short curcuit to 404 page
    if (!userDoc) {
        return {
            notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsRef = collection(firestore, `users/${userDoc.id}/posts`);
        const postsQuery = query(postsRef, where("published", "==", true), orderBy("createdAt", "desc"), limit(10));
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    }
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}