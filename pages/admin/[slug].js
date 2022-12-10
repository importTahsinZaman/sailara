import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PremiumCheck from "../../components/PremiumCheck";
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
import axios from "axios";

import { geohashForLocation } from "geofire-common";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PremiumCheck>
        <PostManager />
      </PremiumCheck>
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
              defaultValues={post}
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

function PostForm({ postRef, defaultValues, preview }) {
  const [checkValid, setCheckValid] = useState(defaultValues["published"]);

  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    reset,
    control,
    getValues,
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({
    subject,
    delivery,
    type,
    session_start,
    session_length,
    cost,
    college_credit,
    grade,
    pays,
    demographic_restriction,
    location,
    location_restriction,
    deadline,
    description,
    attendance,
    link,
    published,
  }) => {
    if (checkValid) {
      published = true;
    } else {
      published = false;
    }

    if (grade == undefined) {
      grade = [];
    }

    if (!useDemographic || demographic_restriction == undefined) {
      demographic_restriction = false;
    }

    if (!useLocation || location_restriction == undefined) {
      location_restriction = false;
    }

    let coords = {};
    let hash = null;
    if (checkValid) {
      await getCoords(location).then((response) => {
        coords = response;
        hash = geohashForLocation([coords.lat, coords.lon]);
      });
    }
    console.log(deadline);
    let formatted_deadline = deadline.split("-");
    console.log(
      `${formatted_deadline[1]}-${formatted_deadline[2]}-${formatted_deadline[0]}`
    );

    await updateDoc(postRef, {
      subject,
      delivery,
      type,
      session_start,
      session_length,
      cost,
      college_credit,
      grade,
      pays,
      demographic_restriction,
      location,
      location_restriction,
      coords: coords,
      hash: hash,
      deadline: new Date(
        `${formatted_deadline[1]}-${formatted_deadline[2]}-${formatted_deadline[0]}`
      ),
      description,
      attendance,
      link,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({
      subject,
      delivery,
      type,
      session_start,
      session_length,
      cost,
      college_credit,
      grade,
      pays,
      demographic_restriction,
      location,
      location_restriction,
      description,
      attendance,
      deadline,
      link,
      published,
    });

    toast.success("Post updated successfully!");
  };

  const getCoords = async (query) => {
    const apiKey = "f37e890dd41d4a1da92c0572c6a1ddee";
    let lat,
      lon = null;
    var config = {
      method: "get",
      url: `https://api.geoapify.com/v1/geocode/search?text=${query}&format=json&apiKey=${apiKey}`,
      headers: {},
    };

    await axios(config)
      .then(function (response) {
        lat = response.data.results[0].lat;
        lon = response.data.results[0].lon;
      })
      .catch(function (error) {
        console.log(error);
      });

    return { lat, lon };
  };

  const gradeOptions = [
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];

  const demographicOptions = [
    { value: "Underrepresented Gender", label: "Underrepresented Gender" },
    {
      value: "Underrepresented Race/Ethnicity",
      label: "Underrepresented Race/Ethnicity",
    },
    { value: "First Generation", label: "First Generation" },
    { value: "Low Income", label: "Low Income" },
  ];

  //To check for form validity if user clicked the "publish" button

  const get_select_defaults = (field) => {
    //get default values for custom react-select library components
    try {
      var defaults = [];
      defaultValues[field].forEach((value) => {
        defaults.push({ label: value, value: value });
      });
      return defaults;
    } catch (err) {
      console.log("Err with getting select defaults OR new post " + err);
    }
  };

  const [useDemographic, setUseDemographic] = useState(
    defaultValues["demographic_restriction"] !== false
  );
  const [useLocation, setUseLocation] = useState(
    defaultValues["location_restriction"] !== false
  );

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

        <label>Program Delivery:</label>
        <select {...register("delivery", { required: checkValid })}>
          <option value="In-Person Commuter">In-Person Commuter</option>
          <option value="In-Person Residential">In-Person Residential</option>
          <option value="Virtual">Virtual</option>
          <option value="Hybrid">Hybrid</option>
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

        <label>Session Start:</label>
        <select {...register("session_start", { required: checkValid })}>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>

        <label>Session Length:</label>
        <select {...register("session_length", { required: checkValid })}>
          <option value="1 week">1 week</option>
          <option value="2 weeks">2 weeks</option>
          <option value="3 weeks">3 weeks</option>
          <option value="4 weeks">4 weeks</option>
          <option value="5 weeks">5 weeks</option>
          <option value="6 weeks">6 weeks</option>
          <option value="2 months">2 months</option>
          <option value="3 months">3 months</option>
          <option value="4 months">4 months</option>
          <option value="5+ months">5+ months</option>
          <option value="School Year">School Year</option>
          <option value="Other">Other</option>
        </select>

        <label>Minimum Cost:</label>
        <select {...register("cost", { required: checkValid })}>
          <option value="Free">Free</option>
          <option value="<$500">{`<$500`}</option>
          <option value="$500 - $1,499">$500 - $1,499</option>
          <option value="$1,500 - $2,999">$1,500 - $2,999</option>
          <option value="> $3,000">{`> $3,000`}</option>
        </select>

        <fieldset>
          <input
            {...register("college_credit")}
            className={styles.checkbox}
            name="college_credit"
            type="checkbox"
            // disabled={!isDirty || !isValid}
            defaultChecked={defaultValues["pays"]}
          />
          <label>Awards College Credit</label>
        </fieldset>

        <label>Entering Grade (Or Current Grade if School Year):</label>
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

        <fieldset>
          <input
            {...register("pays")}
            className={styles.checkbox}
            name="pays"
            type="checkbox"
            // isabled={!isDirty || !isValid}
            defaultChecked={defaultValues["pays"]}
          />
          <label>Pays</label>
        </fieldset>

        <fieldset>
          <input
            type="checkbox"
            defaultChecked={useDemographic}
            className={styles.checkbox}
            onClick={() => {
              setUseDemographic(!useDemographic);
            }}
          />
          <label>Demographic Restrictions</label>
        </fieldset>
        {useDemographic && (
          <Controller
            name="demographic_restriction"
            rules={{ required: useDemographic && checkValid }}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Select
                  options={demographicOptions}
                  closeMenuOnSelect={false}
                  isDisabled={!useDemographic}
                  isMulti
                  value={demographicOptions.find((c) => c.value === value)}
                  onChange={(val) => onChange(val.map((c) => c.value))}
                  defaultValue={get_select_defaults("demographic_restriction")}
                ></Select>
              );
            }}
          />
        )}

        <label>
          Program Address (Enter even if no restriction by location):
        </label>
        <input
          {...register("location", {
            required: checkValid,
          })}
          placeholder="Street Address"
        ></input>
        <button
          type="button"
          onClick={(e) => {
            getCoords(getValues("location")).then((response) => {
              window.open(
                `https://google.com/maps/place/(${response.lat},${response.lon})`,
                "_blank"
              );
            });
          }}
        >
          Check Address Validity
        </button>

        <fieldset>
          <input
            type="checkbox"
            className={styles.checkbox}
            defaultChecked={useLocation}
            onClick={() => {
              setUseLocation(!useLocation);
            }}
          />
          <label>Location Restriction</label>
        </fieldset>
        {useLocation && (
          <select
            {...register("location_restriction", {
              required: useLocation && checkValid,
            })}
          >
            <option value="By City">By City</option>
            <option value="By State">By State</option>
          </select>
        )}

        <label>Application Deadline</label>
        <input
          {...register("deadline")}
          type="date"
          // value={defaultValues["deadline"].toString()}
          // min="2022-01-01"
        ></input>

        <label>Program Description:</label>
        <textarea
          {...register("description", {
            required: checkValid,
            minLength: checkValid ? 50 : 0,
            maxLength: checkValid ? 1000 : 10000000,
          })}
        ></textarea>

        <label>Attendance Requirements:</label>
        <textarea
          {...register("attendance", {
            required: checkValid,
            minLength: checkValid ? 10 : 0,
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
        <fieldset>
          <input
            {...register("published")}
            className={styles.checkbox}
            type="checkbox"
            onClick={() => setCheckValid(!checkValid)}
            defaultChecked={checkValid}
          />
          <label>Published</label>
        </fieldset>

        {/* Error messages for when the user has selected "publish" */}
        {checkValid && errors.description?.type === "required" && (
          <p className="text-danger">Description Is Required To Publish</p>
        )}
        {checkValid && errors.description?.type === "minLength" && (
          <p className="text-danger">Description Is Too Short to publish</p>
        )}
        {checkValid && errors.description?.type === "maxLength" && (
          <p className="text-danger">Description Is Too Long to publish</p>
        )}

        {checkValid && errors.duration?.type === "required" && (
          <p className="text-danger">Duration Is Required To Publish</p>
        )}
        {checkValid && errors.duration?.type === "minLength" && (
          <p className="text-danger">Duration Is Too Short to publish</p>
        )}
        {checkValid && errors.duration?.type === "maxLength" && (
          <p className="text-danger">Duration Is Too Long to publish</p>
        )}
        {checkValid && errors.link?.type === "required" && (
          <p className="text-danger">Link Is Required To Publish</p>
        )}
        {checkValid && errors.link?.type === "pattern" && (
          <p className="text-danger">Link must be valid url to publish</p>
        )}
        {checkValid && errors.grade?.type === "required" && (
          <p className="text-danger">Grade is required to publish</p>
        )}
        {checkValid && errors.race?.type === "required" && (
          <p className="text-danger">Race is required to publish</p>
        )}
        {checkValid && errors.ethnicity?.type === "required" && (
          <p className="text-danger">Ethnicity is required to publish</p>
        )}
        {checkValid && errors.gender?.type === "required" && (
          <p className="text-danger">Gender is required to publish</p>
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
