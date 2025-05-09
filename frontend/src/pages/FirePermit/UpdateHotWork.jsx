import React, { useState, useEffect } from "react";
import styles from "./HotWorkPermitForm.module.css";

const UpdateHotWork = ({ setHotWork, setDisplayHotWork, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    jobDetails: "",
    tools: "",
    location: "",
    interaction: "",
    approvalBy: "",
    approvalDate: "",
    approvalTime: "",
    hours: "",
    shiftDay: "",
    questions: Array(10).fill(""),
  });

  // Initialize form with existing data if provided
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHotWork(formData);
    setDisplayHotWork(false);
  };

  const handleCancel = () => {
    setDisplayHotWork(false);
  };

  const questions = [
    "Are you qualified/trained to undertake this work?",
    "Has a sprinkler system/fixed fire installation been left in service?",
    "Are extinguishers or a hose pipe to hand?",
    "Are there means of sounding to fire alarms to hand?",
    "Is the area cleared of combustible material and/or protected?",
    "Have the flammable liquid contains been removed and/or protected?",
    "Is intrinsically safe equipment to be used?",
    "Is the area safe and no one is close to the operational area?",
    "Smoke alarms covered?",
    "Adjoining equipment and operations considered?",
  ];

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.title}>HOT WORK PERMIT</div>

      <div className={styles.section}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label>JOB DETAILS</label>
        <textarea
          name="jobDetails"
          value={formData.jobDetails}
          onChange={handleInputChange}
          required
        />

        <label>SPECIAL TOOLS TO BE USED</label>
        <input
          type="text"
          name="tools"
          value={formData.tools}
          onChange={handleInputChange}
        />

        <label>JOB LOCATION / PLANT IDENTIFICATION</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        <label>
          IS ANY OTHER WORK CURRENTLY BEING UNDERTAKEN THAT MAY INTERACT OR
          AFFECT THIS PERMIT?
        </label>
        <input
          type="text"
          name="interaction"
          value={formData.interaction}
          onChange={handleInputChange}
        />

        <p className={styles.notice}>
          This permit is valid only when all sections are completed...
        </p>
      </div>

      <div className={styles.hazards}>
        HAZARDS AND PRECAUTION TO BE TAKEN
        <div className={styles.primaryHazards}>
          PRIMARY HAZARDS - fumes, electrics, gases, liquids, radiation, fire,
          soldering
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>PLEASE ANSWER THE FOLLOWING QUESTIONS TRUTHFULLY</th>
            <th>YES</th>
            <th>NO</th>
            <th>N/A</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={idx}>
              <td>{q}</td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="YES"
                  checked={formData.questions[idx] === "YES"}
                  onChange={() => handleQuestionChange(idx, "YES")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="NO"
                  checked={formData.questions[idx] === "NO"}
                  onChange={() => handleQuestionChange(idx, "NO")}
                />
              </td>
              <td>
                <input
                  type="radio"
                  name={`q${idx}`}
                  value="N/A"
                  checked={formData.questions[idx] === "N/A"}
                  onChange={() => handleQuestionChange(idx, "N/A")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.authorization}>
        <p>
          I confirm that I have verified the above information and ensured the
          necessary precautions have been taken...
        </p>

        <div className={styles.approval}>
          <label>APPROVED BY</label>
          <input
            type="text"
            name="approvalBy"
            value={formData.approvalBy}
            onChange={handleInputChange}
            required
          />

          <label>DATE</label>
          <input
            type="date"
            name="approvalDate"
            value={formData.approvalDate}
            onChange={handleInputChange}
            required
          />

          <label>TIME</label>
          <input
            type="time"
            name="approvalTime"
            value={formData.approvalTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.permitInfo}>
          HOT PERMIT WORK IS GOOD FOR
          <input
            type="number"
            name="hours"
            className={styles.inlineInput}
            value={formData.hours}
            onChange={handleInputChange}
            min="1"
            required
          />
          HOURS ONLY.
          <br />
          THIS PERMIT CAN BE USED FOR ONLY ONE SHIFT. IT BECOMES VOID AT THE END
          OF WORK SHIFT
          <input
            type="text"
            name="shiftDay"
            className={styles.inlineInput}
            value={formData.shiftDay}
            onChange={handleInputChange}
            required
          />
          .
        </div>
      </div>

      <div className={styles.signatureSection}>
        <table className={styles.signatureTable}>
          <thead>
            <tr>
              <th></th>
              <th>HSE Member</th>
              <th>Worker</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Signature Before Operation</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Signature After Operation</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UpdateHotWork;
