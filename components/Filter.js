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

  const deliveryOptions = [
    { value: "In-Person Commuter", label: "In-Person Commuter" },
    { value: "In-Person Residential", label: "In-Person Residential" },
    { value: "Virtual", label: "Virtual" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  const typeOptions = [
    { value: "Summer Program", label: "Summer Program" },
    { value: "School Year Program", label: "School Year Program" },
    { value: "1-4 Year Program", label: "1-4 Year Program" },
    { value: "Internship", label: "Internship" },
    { value: "College Prep Program", label: "College Prep Program" },
    { value: "Scholarship", label: "Scholarship" },
  ];

  const sessionStartOptions = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const sessionLengthOptions = [
    { value: "1 week", label: "1 week" },
    { value: "2 weeks", label: "2 weeks" },
    { value: "3 weeks", label: "3 weeks" },
    { value: "4 weeks", label: "4 weeks" },
    { value: "5 weeks", label: "5 weeks" },
    { value: "6 weeks", label: "6 weeks" },
    { value: "2 months", label: "2 months" },
    { value: "3 months", label: "3 months" },
    { value: "4 months", label: "4 months" },
    { value: "5+ months", label: "5+ months" },
    { value: "School Year", label: "School Year" },
    { value: "Other", label: "Other" },
  ];

  const costOptions = [
    { value: "Free", label: "Free" },
    { value: "<$500", label: "<$500" },
    { value: "$500 - $1,499", label: "$500 - $1,499" },
    { value: "$1,500 - $2,999", label: "$1,500 - $2,999" },
    { value: "> $3,000", label: "> $3,000" },
  ];

  const collegeCreditOptions = [
    { value: true, label: "Yes, program offers college credit" },
  ];

  const gradeOptions = [
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];

  const paysOptions = [
    { value: true, label: "Yes, program pays students for participation" },
  ];

  const demographicOptions = [
    {
      value: false,
      label: "No, admission is not based on student's demographic",
    },
  ];

  const locationOptions = [
    { value: false, label: "No, admission is not based on student's location" },
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
                placeholder={
                  <div className="select-placeholder-text">Subject</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />
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
                placeholder={
                  <div className="select-placeholder-text">Type</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />
        <Controller
          name="delivery"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={deliveryOptions}
                closeMenuOnSelect={false}
                isMulti
                value={deliveryOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Delivery</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />
        <Controller
          name="grade"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={gradeOptions}
                closeMenuOnSelect={false}
                isMulti
                value={gradeOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Entering Grade</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="session_start"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={sessionStartOptions}
                closeMenuOnSelect={false}
                isMulti
                value={sessionStartOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Session Start</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="session_length"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={sessionLengthOptions}
                closeMenuOnSelect={false}
                isMulti
                value={sessionLengthOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Session Length</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="cost"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={costOptions}
                closeMenuOnSelect={false}
                isMulti
                value={costOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Minimum Cost</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="college_credit"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={collegeCreditOptions}
                closeMenuOnSelect={false}
                isMulti
                value={collegeCreditOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">College Credit</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="pays"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={paysOptions}
                closeMenuOnSelect={false}
                isMulti
                value={paysOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">Pays</div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="demographic_restriction"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={demographicOptions}
                closeMenuOnSelect={false}
                isMulti
                value={demographicOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">
                    Demographic Restrictions
                  </div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

        <Controller
          name="location_restriction"
          // rules={{ required: true }}
          control={control}
          render={({ field: { onChange, value } }) => {
            return (
              <Select
                options={locationOptions}
                closeMenuOnSelect={false}
                isMulti
                value={locationOptions.find((c) => c.value === value)}
                onChange={(val) => onChange(val.map((c) => c.value))}
                placeholder={
                  <div className="select-placeholder-text">
                    Location Restrictions
                  </div>
                }
                // defaultValue={get_select_defaults("grade")}
              ></Select>
            );
          }}
        />

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
  function filterDelivery(r) {
    if (filters.delivery && filters.delivery.length > 0) {
      if (filters.delivery.includes(r.delivery)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterGrade(r) {
    if (filters.grade && filters.grade.length > 0) {
      if (filters.grade.some((x) => r.includes(x))) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterSessionStart(r) {
    if (filters.session_start && filters.session_start.length > 0) {
      if (filters.session_start.includes(r.session_start)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterSessionLength(r) {
    if (filters.session_length && filters.session_length.length > 0) {
      if (filters.session_length.includes(r.session_length)) {
        return r;
      }
    } else {
      return r;
    }
  }
  function filterCost(r) {
    if (filters.cost && filters.cost.length > 0) {
      if (filters.cost.includes(r.cost)) {
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
  var deliveryResult = posts.filter(filterDelivery).map((r) => r.title);
  var gradeResult = posts.filter(filterGrade).map((r) => r.title);
  var sessionStartResult = posts.filter(filterSessionStart).map((r) => r.title);
  var sessionLengthResult = posts
    .filter(filterSessionLength)
    .map((r) => r.title);
  var costResult = posts.filter(filterCost).map((r) => r.title);

  const programTitles = intersectMany(
    subjectResult,
    typeResult,
    deliveryResult,
    gradeResult,
    sessionStartResult,
    sessionLengthResult,
    costResult
  );

  var finalFilter = [];

  posts.forEach((program) => {
    if (programTitles.includes(program.title)) {
      finalFilter.push(program);
    }
  });

  return finalFilter;
}
