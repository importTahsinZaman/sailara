import AuthCheck from "../../../components/AuthCheck";
import PremiumCheck from "../../../components/PremiumCheck";

import { useRouter } from "next/router";
import { auth } from "../../../lib/firebase";
import { doc, getFirestore } from "firebase/firestore";
import { useState } from "react";

import { useDocumentDataOnce } from "../../../lib/reactFirebaseHooks.ts";

const GetPostData = () => {
  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser.uid,
    "posts",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);
  return post;
};

const GetStudents = (filters) => {
  let filterParameters = [];

  if (filters.pays === false) {
    //If the program doesn't pay, then query for students that are ok with not getting paid
    filterParameters.push(where("pays_preference", "==", false));
  }
  if (filters.virtual === true) {
    //If the program is virtual, then query for students that are ok with it being virtual
    filterParameters.push(where("virtual_preference", "==", true));
  }
  if (filters.hasCost === true) {
    //If the program has a cost, then query for students that are ok with it having a cost
    filterParameters.push(where("hasCost_preference", "==", true));
  }

  const students = query(
    "users",
    where("grade_preference", "in", filters.grade),
    where("subject_preference", "array_contains", filters.subject),
    ...filterParameters,
    where("email_preference", "==", true)
  );

  return students;
};

export default function Email() {
  return (
    <AuthCheck>
      <PremiumCheck>heyyy</PremiumCheck>
    </AuthCheck>
  );
}
