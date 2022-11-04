import styles from "../styles/Admin.module.css";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

export default function Filter({ onSubmit }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm({ mode: "onChange" });

  const subjectOptions = [
    { value: "Activism", label: "Activism" },
    { value: "Administration", label: "Administration" },
    { value: "Advocacy", label: "Advocacy" },
    { value: "Animation", label: "Animation" },
    { value: "Arts", label: "Arts" },
    { value: "Business", label: "Business" },
    { value: "Career", label: "Career" },
    { value: "Civics", label: "Civics" },
    { value: "Culture", label: "Culture" },
    { value: "Dance", label: "Dance" },
    { value: "Democracy", label: "Democracy" },
    { value: "Education", label: "Education" },
    { value: "Engineering", label: "Engineering" },
    { value: "Environmental", label: "Environmental" },
    { value: "Film", label: "Film" },
    { value: "Finance", label: "Finance" },
    { value: "Genetics", label: "Genetics" },
    { value: "Graphic Design", label: "Graphic Design" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Journalism", label: "Journalism" },
    { value: "Leadership", label: "Leadership" },
    { value: "Marketing", label: "Marketing" },
    { value: "Math", label: "Math" },
    { value: "Medicine", label: "Medicine" },
    { value: "Music", label: "Music" },
    { value: "Outreach", label: "Outreach" },
    { value: "Photography", label: "Photography" },
    { value: "Research", label: "Research" },
    { value: "STEM", label: "STEM" },
    { value: "Social Justice", label: "Social Justice" },
    { value: "Teaching", label: "Teaching" },
    { value: "Tech", label: "Tech" },
    { value: "Web Design", label: "Web Design" },
  ];

  const typeOptions = [
    { value: "Summer Program", label: "Summer Program" },
    { value: "School Year Program", label: "School Year Program" },
    { value: "1-4 Year Program", label: "1-4 Year Program" },
    { value: "Internship", label: "Internship" },
    { value: "College Prep Program", label: "College Prep Program" },
    { value: "Scholarship", label: "Scholarship" },
  ];

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.controls}>
        <label>Subject:</label>
        <Controller
          name="subject"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={subjectOptions}
                closeMenuOnSelect={false}
                isMulti
                value={subjectOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <label>Type:</label>
        <Controller
          name="type"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={typeOptions}
                closeMenuOnSelect={false}
                isMulti
                value={typeOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <label>Grade:</label>
        <select {...register("grade")}>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
        </select>

        <label>I identify as (ethnicity):</label>
        <select {...register("ethnicity")}>
          <option value="Not of Hispanic, Latino/a/x, or Spanish origin">
            Not of Hispanic, Latino/a/x, or Spanish origin
          </option>
          <option value="Mexican, Mexican American, Chicano/a/x">
            Mexican, Mexican American, Chicano/a/x
          </option>
          <option value="Puerto Rican">Puerto Rican</option>
          <option value="Cuban">Cuban</option>
          <option value="Other">Other</option>
        </select>

        <label>I identify as (race):</label>
        <select {...register("race")}>
          <option value="American Indian or Alaskan Native">
            American Indian or Alaskan Native
          </option>
          <option value="Asian">Asian</option>
          <option value="Black or African American">
            Black or African American
          </option>
          <option value="Native Hawaiian or Pacific Islander">
            Native Hawaiian or Pacific Islander
          </option>
          <option value="White">White</option>
          <option value="Other">Other</option>
        </select>

        <label>I identify as (gender):</label>
        <select {...register("gender")}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other/Multiple">Other/Multiple</option>
        </select>

        <label>I am a first generation college student:</label>
        <fieldset>
          <input
            {...register("firstgen")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>firstgen</label>
        </fieldset>

        <label>I am low income:</label>
        <fieldset>
          <input
            {...register("income")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>low income</label>
        </fieldset>

        <label>Pays:</label>
        <fieldset>
          <input
            {...register("pays")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>Pays:</label>
        </fieldset>

        <label>Virtual:</label>
        <fieldset>
          <input
            {...register("virtual")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>Virtual:</label>
        </fieldset>

        <label>Has Cost:</label>
        <fieldset>
          <input
            {...register("hasCost")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>Has Cost:</label>
        </fieldset>

        <button type="submit" className="btn-green">
          Filter
        </button>
      </div>
    </form>
  );
}
