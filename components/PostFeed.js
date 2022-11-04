import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  return (
    <div className="card">
      <h1>{post.title}</h1>
      <p>{post.subject + " - " + post.type}</p>
      <p>{post.description}</p>
      <p>{post.duration}</p>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}

      <footer>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>
    </div>
  );
}
