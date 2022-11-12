import { getUserWithUsername, postToJSON, firestore } from "../../lib/firebase";
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from "firebase/firestore";
import UserProfile from "../../components/UserProfile";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";

import { useContext } from "react";
import { UserContext } from "../../lib/context";

import AuthCheck from "../../components/AuthCheck";
import { Filter } from "../../components/Filter.js";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  const { username } = useContext(UserContext);
  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  };

  return (
    <main>
      <Metatags
        title={user.username}
        description={`${user.username}'s profile`}
      />
      <UserProfile user={user} />
      {username == router.query.username ? (
        <AuthCheck>
          <button onClick={signOutNow}>Sign Out</button>
          <Filter
            onSubmit={(filters) => {
              console.log("save");
            }}
            buttonText={"Save"}
          ></Filter>
        </AuthCheck>
      ) : (
        <PostFeed posts={posts} />
      )}
    </main>
  );
}
