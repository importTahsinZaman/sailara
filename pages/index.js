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

import { useState } from "react";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  // const postsQuery = firestore
  //   .collectionGroup('posts')
  //   .where('published', '==', true)
  //   .orderBy('createdAt', 'desc')
  //   .limit(LIMIT);
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
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    // const query = firestore
    //   .collectionGroup('posts')
    //   .where('published', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .startAfter(cursor)
    //   .limit(LIMIT);

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

  async function checkout() {
    const ref = collection(
      getFirestore(),
      "users",
      auth.currentUser.uid,
      "checkout_sessions"
    );

    const payload = {
      price: "price_1LeMqhGRi1AVJ1EusAVlw3Fg",
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    };

    var docRef = await addDoc(ref, payload);

    const snapshot = onSnapshot(docRef, (doc) => {
      const { error, url } = doc.data();
      if (error) {
        // Show an error to your customer and
        // inspect your Cloud Function logs in the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });
  }

  async function test() {
    await auth.currentUser.getIdToken(true);
    const decodedToken = await auth.currentUser?.getIdTokenResult();
    const temp = decodedToken.claims.stripeRole == "educator";
    return temp;
  }

  return (
    <main>
      <Metatags
        title="Home Page"
        description="Get the latest posts on our site"
      />

      <div className="card card-info">
        <h2>WIP Sailara</h2>
        <p>Welcome!</p>
      </div>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
      <button onClick={checkout}>upgrade</button>
      <button
        onClick={() => {
          console.log(test());
        }}
      ></button>
    </main>
  );
}
