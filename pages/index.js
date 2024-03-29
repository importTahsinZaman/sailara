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
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const [savedFilters, setSavedFilters] = useState(null); //Used in custom filter function
  const [filterParameters, setFilteredParameters] = useState([]); //Used to build query, need state for this to use in load more posts

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
      ...filterParameters, //This line takes care of making sure only filtered posts are gotten
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    let newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }

    if (filterParameters.length > 0) {
      //Final filtering that needs to be done. Does not run if user didn't set filters
      newPosts = filterPrograms(newPosts, savedFilters);
    }

    setPosts(posts.concat(newPosts));
    setLoading(false);
  };

  const queryFilteredPosts = async (filters) => {
    const ref = collectionGroup(getFirestore(), "posts");

    let filterParameters = [];

    if (
      filters.pays !== undefined &&
      filters.pays.length > 0 &&
      filters.pays.includes(true)
    ) {
      filterParameters.push(where("pays", "==", true));
    }
    if (
      filters.college_credit !== undefined &&
      filters.college_credit.length > 0 &&
      filters.college_credit.includes(true)
    ) {
      filterParameters.push(where("college_credit", "==", true));
    }
    if (
      filters.demographic_restriction !== undefined &&
      filters.demographic_restriction.length > 0 &&
      filters.demographic_restriction.includes(false)
    ) {
      filterParameters.push(where("demographic_restriction", "==", false));
    }
    if (
      filters.location_restriction !== undefined &&
      filters.location_restriction.length > 0 &&
      filters.location_restriction.includes(false)
    ) {
      filterParameters.push(where("location_restriction", "==", false));
    }

    if (filters.subject !== undefined && filters.subject.length > 0) {
      filterParameters.push(where("subject", "in", filters.subject));
    } else if (filters.type !== undefined && filters.type.length > 0) {
      filterParameters.push(where("type", "in", filters.type));
    } else if (filters.delivery !== undefined && filters.delivery.length > 0) {
      filterParameters.push(where("delivery", "in", filters.delivery));
    } else if (
      filters.session_start !== undefined &&
      filters.session_start.length > 0
    ) {
      filterParameters.push(
        where("session_start", "in", filters.session_start)
      );
    } else if (
      filters.session_length !== undefined &&
      filters.session_length.length > 0
    ) {
      filterParameters.push(
        where("session_length", "in", filters.session_length)
      );
    } else if (filters.cost !== undefined && filters.cost.length > 0) {
      filterParameters.push(where("cost", "in", filters.cost));
    }

    setFilteredParameters(filterParameters);

    const postsQuery = query(
      ref,
      where("published", "==", true),
      ...filterParameters,
      orderBy("createdAt", "desc"),
      limit(LIMIT)
    );

    let queryResults = (await getDocs(postsQuery)).docs.map(postToJSON);
    queryResults = filterPrograms(queryResults, filters);

    setPosts(queryResults);
  };

  return (
    <main>
      <Metatags title="Home Page" description="development" />

      {/* <div className="card card-info">
        <h2>WIP Sailara</h2>
        <p>Welcome!</p>
      </div> */}
      <Filter
        onSubmit={(filters) => {
          console.log(filters);
          setSavedFilters(filters);
          console.log("running query");
          queryFilteredPosts(filters);
        }}
        buttonText={"Filter"}
      ></Filter>

      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
