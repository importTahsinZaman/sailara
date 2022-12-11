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
      <p>{post.subject}</p>
      <p>{post.delivery}</p>
      <p>{post.type}</p>
      <p>{post.session_start}</p>
      <p>{post.session_length}</p>
      <p>{post.cost}</p>
      <p>{post.college_credit}</p>
      <p>{post.pays}</p>
      <p>{post.description}</p>
      {/* <p>{post.deadline}</p> */}
      <p>{post.location}</p>
      <p>{post.duration}</p>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>
          <Link href={`/admin/${post.slug}/email`}>
            <h3>
              <button className="btn-green">Email</button>
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
