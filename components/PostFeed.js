import Link from "next/link";

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem key={post.slug} post={post} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutestoRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="card">

            <Link href={`/${post.username}`}>By @{post.username}</Link>

            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    {post.title}
                </h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {minutestoRead} min read
                </span>
                <span>❤️ {post.heartCount} Hearts</span>
            </footer>

        </div>
    )

}