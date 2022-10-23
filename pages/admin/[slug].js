import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import { auth } from "../../lib/firebase";
import {
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentDataOnce } from "../../lib/reactFirebaseHooks.ts";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

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

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            <PostForm
              postRef={postRef}
              defaultValues={post["content"]}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({
    subject,
    type,
    description,
    duration,
    link,
    published,
    grade,
    pays,
    virtual,
    hasCost,
    race,
    ethnicity,
    gender,
    firstgen,
    income,
  }) => {
    if (checkValid) {
      published = true;
    } else {
      published = false;
    }

    if (grade == undefined) {
      grade = [];
    }
    if (race == undefined) {
      race = [];
    }
    if (ethnicity == undefined) {
      ethnicity = [];
    }
    if (gender == undefined) {
      gender = [];
    }

    await updateDoc(postRef, {
      content: {
        subject,
        type,
        description,
        duration,
        link,
        grade,
        pays,
        virtual,
        hasCost,
        race,
        ethnicity,
        gender,
        firstgen,
        income,
      },
      published,
      updatedAt: serverTimestamp(),
    });

    reset({
      subject,
      type,
      description,
      published,
      duration,
      link,
      grade,
      pays,
      virtual,
      hasCost,
      race,
      ethnicity,
      gender,
      firstgen,
      income,
    });

    toast.success("Post updated successfully!");
  };

  const gradeOptions = [
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  const raceOptions = [
    {
      value: "American Indian or Alaskan Native",
      label: "American Indian or Alaskan Native",
    },
    { value: "Asian", label: "Asian" },
    { value: "Black or African American", label: "Black or African American" },
    {
      value: "Native Hawaiian or Pacific Islander",
      label: "Native Hawaiian or Pacific Islander",
    },
    { value: "White", label: "White" },
    { value: "Other", label: "Other" },
  ];

  const ethnicityOptions = [
    {
      value: "Not of Hispanic, Latino/a/x, or Spanish origin",
      label: "Not of Hispanic, Latino/a/x, or Spanish origin",
    },
    {
      value: "Mexican, Mexican American, Chicano/a/x",
      label: "Mexican, Mexican American, Chicano/a/x",
    },
    { value: "Puerto Rican", label: "Puerto Rican" },
    { value: "Cuban", label: "Cuban" },
    { value: "Other", label: "Other" },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other/Multiple", label: "Other/Multiple" },
  ];

  const [checkValid, setCheckValid] = useState(defaultValues["published"]);

  const get_select_defaults = (field) => {
    var defaults = [];
    defaultValues[field].forEach((value) => {
      defaults.push({ label: value, value: value });
    });
    return defaults;
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && <div className="card"></div>}
      <div className={preview ? styles.hidden : styles.controls}>
        <label>Program Subject:</label>
        <select {...register("subject", { required: checkValid })}>
          <option value="Activism">Activism</option>
          <option value="Administration">Administration</option>
          <option value="Advocacy">Advocacy</option>
          <option value="Animation">Animation</option>
          <option value="Arts">Arts</option>
          <option value="Business">Business</option>
          <option value="Career">Career</option>
          <option value="Civics">Civics</option>
          <option value="Culture">Culture</option>
          <option value="Dance">Dance</option>
          <option value="Democracy">Democracy</option>
          <option value="Education">Education</option>
          <option value="Engineering">Engineering</option>
          <option value="Environmental">Environmental</option>
          <option value="Film">Film</option>
          <option value="Finance">Finance</option>
          <option value="Genetics">Genetics</option>
          <option value="Graphic Design">Graphic Design</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Journalism">Journalism</option>
          <option value="Leadership">Leadership</option>
          <option value="Marketing">Marketing</option>
          <option value="Math">Math</option>
          <option value="Medicine">Medicine</option>
          <option value="Music">Music</option>
          <option value="Outreach">Outreach</option>
          <option value="Photography">Photography</option>
          <option value="Research">Research</option>
          <option value="STEM">STEM</option>
          <option value="Social Justice">Social Justice</option>
          <option value="Teaching">Teaching</option>
          <option value="Tech">Tech</option>
          <option value="Web Design">Web Design</option>
        </select>

        <label>Program Type:</label>
        <select {...register("type", { required: checkValid })}>
          <option value="Summer Program">Summer Program</option>
          <option value="School Year Program">School Year Program</option>
          <option value="1-4 Year Program">1-4 Year Program</option>
          <option value="Internship">Internship</option>
          <option value="College Prep Program">College Prep Program</option>
          <option value="Scholarship">Scholarship</option>
        </select>

        <label>Program Description:</label>
        <textarea
          {...register("description", {
            required: checkValid,
            minLength: checkValid ? 50 : 0,
            maxLength: checkValid ? 100 : 10000000,
          })}
        ></textarea>

        <label>Program Duration/Attendance Requirements:</label>
        <textarea
          {...register("duration", {
            required: checkValid,
            minLength: checkValid ? 50 : 0,
            maxLength: checkValid ? 100 : 10000000,
          })}
        ></textarea>

        <label>Website/Infographic Link:</label>
        <input
          type="text"
          {...register("link", {
            required: checkValid,
            pattern:
              /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi,
          })}
        ></input>

        <label>Student Grade (rising grade if summer program):</label>
        <Controller
          name="grade"
          rules={{ required: checkValid }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={gradeOptions}
                closeMenuOnSelect={false}
                isMulti
                value={gradeOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <label>Students will be payed:</label>
        <select {...register("pays", { required: checkValid })}>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>

        <label>Program is virtual:</label>
        <select {...register("virtual", { required: checkValid })}>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>

        <label>Program has a cost:</label>
        <select {...register("hasCost", { required: checkValid })}>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>

        <label>Program primarily looks for students who are:</label>
        <Controller
          name="race"
          rules={{ required: checkValid }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={raceOptions}
                closeMenuOnSelect={false}
                isMulti
                value={raceOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("race")}
              ></Select>
            );
          }}
        />

        <label>Program primarily looks for students who are:</label>
        <Controller
          name="ethnicity"
          rules={{ required: checkValid }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={ethnicityOptions}
                closeMenuOnSelect={false}
                isMulti
                value={ethnicityOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("ethnicity")}
              ></Select>
            );
          }}
        />

        <label>Program primarily looks for students who identify as:</label>
        <Controller
          name="gender"
          rules={{ required: checkValid }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={genderOptions}
                closeMenuOnSelect={false}
                isMulti
                value={genderOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("gender")}
              ></Select>
            );
          }}
        />

        <label>
          Program ONLY accepts students who are First Generation college
          students:
        </label>
        <select {...register("firstgen", { required: checkValid })}>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>

        <label>Program ONLY accepts students who are low income:</label>
        <select {...register("income", { required: checkValid })}>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>

        <fieldset {...register("published")}>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            onClick={() => setCheckValid(!checkValid)}
            // disabled={!isDirty || !isValid}
          />
          <label>Published</label>
        </fieldset>

        {checkValid && errors.description?.type === "required" && (
          <p className="text-danger">Description Is Required To Publish</p>
        )}
        {checkValid && errors.description?.type === "minLength" && (
          <p className="text-danger">Description Is Too Short</p>
        )}
        {checkValid && errors.description?.type === "maxLength" && (
          <p className="text-danger">Description Is Too Long</p>
        )}

        {checkValid && errors.duration?.type === "required" && (
          <p className="text-danger">Duration Is Required To Publish</p>
        )}
        {checkValid && errors.duration?.type === "minLength" && (
          <p className="text-danger">Duration Is Too Short</p>
        )}
        {checkValid && errors.duration?.type === "maxLength" && (
          <p className="text-danger">Duration Is Too Long</p>
        )}

        {checkValid && errors.link?.type === "required" && (
          <p className="text-danger">Link Is Required To Publish</p>
        )}
        {checkValid && errors.link?.type === "pattern" && (
          <p className="text-danger">Link must be valid url</p>
        )}

        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
