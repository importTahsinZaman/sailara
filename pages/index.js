import PostFeed from "../components/PostFeed";
import Metatags from "../components/Metatags";
import Loader from "../components/Loader";
import { postToJSON } from "../lib/firebase";
import {
  Timestamp,
  query,
  where,
  orderBy,
  limit,
  collectionGroup,
  collection,
  getDocs,
  startAfter,
  getFirestore,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../lib/firebase";

import { useState, useEffect } from "react";

import { Filter, filterPrograms } from "../components/Filter.js";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), "posts");
  const postsQuery = query(
    ref,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const [filters, setFilters] = useState([]);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const ref = collectionGroup(getFirestore(), "posts");
    const postsQuery = query(
      ref,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  useEffect(() => {
    console.log(JSON.stringify(filters));
    setFilteredPosts(filterPrograms(posts, filters));
  }, [posts, filters]);

  return (
    <main>
      <Metatags title="Home Page" description="development" />

      <div className="card card-info">
        <h2>WIP Sailara</h2>
        <p>Welcome!</p>
      </div>
      <Filter
        onSubmit={(data) => {
          setFilters(data);
        }}
      ></Filter>

      <PostFeed posts={filteredPosts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
