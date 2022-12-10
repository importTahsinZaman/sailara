import styles from "../styles/Admin.module.css";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

export function Filter({ onSubmit, buttonText, userProfile }) {
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
                // defaultValue={get_select_defaults("grade")}
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
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <label>Grade:</label>
        <select {...register("grade")}>
          <option value={9}>9</option>
          <option value={10}>10</option>
          <option value={11}>11</option>
          <option value={12}>12</option>
        </select>

        <fieldset>
          <input
            {...register("pays")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>Pays: (if selected, will ONLY show programs that pay)</label>
        </fieldset>

        {userProfile && (
          <fieldset>
            <input
              {...register("email_preference")}
              className={styles.checkbox}
              type="checkbox"
              defaultChecked={true}
            />
            <label>
              Send me emails for opportunities that fit my preferences
            </label>
          </fieldset>
        )}

        <button type="submit" className="btn-green">
          {buttonText}
        </button>
      </div>
    </form>
  );
}

export function filterPrograms(posts, filters) {
  function filterSubject(r) {
    if (filters.subject && filters.subject.length > 0) {
      if (filters.subject.includes(r.subject)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterType(r) {
    if (filters.type && filters.type.length > 0) {
      if (filters.type.includes(r.type)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterGrade(r) {
    if (filters.grade) {
      if (r.grade.includes(filters.grade / 1)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterTitle(r) {
    if (filters.search && filters.search != "") {
      if (
        r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return r;
      }
    } else {
      return r;
    }
  }

  const intersection = (arr1, arr2) => {
    const res = [];
    for (let i = 0; i < arr1.length; i++) {
      if (!arr2.includes(arr1[i])) {
        continue;
      }
      res.push(arr1[i]);
    }
    return res;
  };
  const intersectMany = (...arrs) => {
    let res = arrs[0].slice();
    for (let i = 1; i < arrs.length; i++) {
      res = intersection(res, arrs[i]);
    }
    return res;
  };

  var subjectResult = posts.filter(filterSubject).map((r) => r.title);
  var typeResult = posts.filter(filterType).map((r) => r.title);
  var gradeResult = posts.filter(filterGrade).map((r) => r.title);
  var titleResult = posts.filter(filterTitle).map((r) => r.title);
  const programTitles = intersectMany(
    titleResult,
    typeResult,
    subjectResult,
    gradeResult
  );

  var finalFilter = [];

  posts.forEach((program) => {
    if (programTitles.includes(program.title)) {
      finalFilter.push(program);
    }
  });

  return finalFilter;
}
