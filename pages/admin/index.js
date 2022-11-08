import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PremiumCheck from "../../components/PremiumCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth } from "../../lib/firebase";
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  getFirestore,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "../../lib/reactFirebaseHooks.ts";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PremiumCheck>
          <CreateNewPost />
          <PostList />
        </PremiumCheck>
      </AuthCheck>
    </main>
  );
}

function PostList() {
  // const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  // const query = ref.orderBy('createdAt');

  const ref = collection(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts"
  );
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);

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
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(getFirestore(), "users", uid, "posts", slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  // const importPosts = async () => {
  //   // OLD FUNCTION USED TO GRAB PROGRAMS
  //   function toBool(string) {
  //     return string.toLowerCase() === "true";
  //   }

  //   const programs = await getDocs(collection(getFirestore(), "programs"));

  //   programs.forEach(async (program) => {
  //     let programData = program.data();
  //     programData.grade = programData.grade.map((e) => Number(e));
  //     programData.firstgen = toBool(programData.firstgen);
  //     programData.hasCost = toBool(programData.hasCost);
  //     programData.income = toBool(programData.income);
  //     programData.pays = toBool(programData.pays);
  //     programData.virtual = toBool(programData.virtual);

  //     const slug = encodeURI(kebabCase(programData.name));

  //     const uid = auth.currentUser.uid;
  //     const ref = doc(getFirestore(), "users", uid, "posts", slug);

  //     // Tip: give all fields a default value here
  //     const data = {
  //       title: programData.name,
  //       slug,
  //       uid,
  //       username,
  //       published: true,
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp(),
  //       heartCount: 0,
  //       subject: programData.subject,
  //       type: programData.type,
  //       description: programData.description,
  //       duration: programData.duration,
  //       link: programData.link,
  //       grade: programData.grade,
  //       pays: programData.pays,
  //       virtual: programData.virtual,
  //       hasCost: programData.hasCost,
  //       race: programData.race,
  //       ethnicity: programData.ethnicity,
  //       gender: programData.gender,
  //       firstgen: programData.firstgen,
  //       income: programData.income,
  //     };
  //     await setDoc(ref, data);
  //   });
  // };

  return (
    <>
      <form onSubmit={createPost}>
        <h2>Create New Post:</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className={styles.input}
        />
        <button type="submit" disabled={!isValid} className="btn-green">
          Create
        </button>
      </form>
    </>
  );
}
