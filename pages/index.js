// https://react-hot-toast.com/
import { collectionGroup, getDocs, limit, orderBy, query, startAfter, where, Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast'
import PostFeed from '../components/PostFeed';
import Loader from '../components/Loader';
import { firestore, postToJSON } from '../lib/firebase';

// Max post to query per page
const LIMIT = 3;

export async function getServerSideProps(context) {
  const postsQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("createdAt", "desc"), limit(LIMIT));
  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === "number" ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    // https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query
    const postsQuery = query(collectionGroup(firestore, "posts"), where("published", "==", true), orderBy("createdAt", "desc"), startAfter(cursor), limit(LIMIT));
    const newPosts = (await getDocs(postsQuery)).docs.map(doc => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}

    </main>
  );
}
