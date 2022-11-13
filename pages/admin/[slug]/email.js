import AuthCheck from "../../../components/AuthCheck";
import PremiumCheck from "../../../components/PremiumCheck";

import { useRouter } from "next/router";
import { auth } from "../../../lib/firebase";
import {
  doc,
  getFirestore,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { useState, useEffect } from "react";

import { useDocumentDataOnce } from "../../../lib/reactFirebaseHooks.ts";

export default function Email() {
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
  const [students, setStudents] = useState(undefined);

  const getStudents = async (filters) => {
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

    const ref = collection(getFirestore(), "users");
    const studentsQuery = query(
      ref,
      where("grade_preference", "in", filters.grade),
      where("subject_preference", "array-contains", filters.subject),
      ...filterParameters,
      where("email_preference", "==", true)
    );

    const students = (await getDocs(studentsQuery)).docs.map((doc) =>
      doc.data()
    );

    let final = [];

    students.forEach((student) => {
      if (filters.type.includes(student.type_preference)) {
        final.push(student);
      }
    });

    setStudents(final);
  };

  useEffect(() => {
    console.log(students);
  }, [students]);

  return (
    <AuthCheck>
      <PremiumCheck>
        <>
          <button
            onClick={() => {
              getStudents(post);
            }}
          >
            count students
          </button>
          {students ? students.length : 0}
        </>
      </PremiumCheck>
    </AuthCheck>
  );
}
