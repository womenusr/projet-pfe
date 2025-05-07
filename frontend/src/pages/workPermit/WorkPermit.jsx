import React, { useState } from "react";
import styles from "./WorkPermit.module.css";
import ImageCheckboxGrid from "../../components/common/ImageCheckboxGrid";
import EquipementAgainFire from "../../components/common/EquipementAgainFire";
import axios from "axios";
import HotWorkPermitForm from "../FirePermit/HotWork";

const WorkPermit = () => {
  const [formData, setFormData] = useState({
    coordinatorName: "",
    coordinatorPosition: "",
    speakerName: "",
    speakerPosition: "",
    speakerCIN: "",
    speakerSignature: "",
    accompanyingNumber: "",
    persons: [
      { name: "", position: "", cin: "", signature: "" },
      { name: "", position: "", cin: "", signature: "" },
    ],
    startDateTime: "",
    endDateTime: "",
    placeArea: "",
    natureOfWorks: "",
    toolsUsed: [],
    otherTool: "",
    otherRequirements: "",
    engineerManager: "",
    hseOfficer: "",
    guardJob: "",
    inspectionDate: "",
    inspectionPlace: "",
    coordinatorSignature: "",
    responsibleSignature: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePersonChange = (index, field, value) => {
    const updatedPersons = [...formData.persons];
    updatedPersons[index][field] = value;
    setFormData({ ...formData, persons: updatedPersons });
  };

  const handleCheckboxChange = (tool) => {
    setFormData((prev) => {
      const tools = prev.toolsUsed.includes(tool)
        ? prev.toolsUsed.filter((t) => t !== tool)
        : [...prev.toolsUsed, tool];
      return { ...prev, toolsUsed: tools };
    });
  };

  const tools = [
    "Cutting tool",
    "Drilling tool",
    "Chemical substances",
    "hot working tools (cutting , welding ...)",
    "Live electrical equipment",
    "Working at height equipment",
    "Lifting equipment",
  ];

  function handleAddWorkPermit() {
    axios
      .post("http://localhost:8000/api/work-permit", formData)
      .then((response) => {
        console.log("Work Permit added successfully:", response.data);
      });
    console.log("Work Permit Data:", formData);
  }

  return (
    <>
      {!formData.toolsUsed.includes(tools[3]) && (
        <div className={styles.container}>
          <div className={styles.section}>
            <label>WORK COORDINATOR</label>
            <div className={styles.row}>
              <input
                placeholder="Mr/Mrs"
                name="coordinatorName"
                value={formData.coordinatorName}
                onChange={handleChange}
              />
              <span>position: </span>
              <input
                name="coordinatorPosition"
                value={formData.coordinatorPosition}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.section}>
            <label>COMPANY SPEAKER</label>
            <div className={styles.row}>
              <span>Represented by Mr/Mrs:</span>
              <input
                name="speakerName"
                value={formData.speakerName}
                onChange={handleChange}
              />
              <span>Position:</span>
              <input
                name="speakerPosition"
                value={formData.speakerPosition}
                onChange={handleChange}
              />
              <span>CIN:</span>
              <input
                name="speakerCIN"
                value={formData.speakerCIN}
                onChange={handleChange}
              />
              <span>Signature:</span>
              <input
                name="speakerSignature"
                value={formData.speakerSignature}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <span>Accompanying person (nombre):</span>
              <input
                name="accompanyingNumber"
                value={formData.accompanyingNumber}
                onChange={handleChange}
              />
            </div>
            {formData.persons.map((person, i) => (
              <div className={styles.row} key={i}>
                <span>Mr/Mrs:</span>
                <input
                  value={person.name}
                  onChange={(e) =>
                    handlePersonChange(i, "name", e.target.value)
                  }
                />
                <span>Position:</span>
                <input
                  value={person.position}
                  onChange={(e) =>
                    handlePersonChange(i, "position", e.target.value)
                  }
                />
                <span>CIN:</span>
                <input
                  value={person.cin}
                  onChange={(e) => handlePersonChange(i, "cin", e.target.value)}
                />
                <span>Signature:</span>
                <input
                  value={person.signature}
                  onChange={(e) =>
                    handlePersonChange(i, "signature", e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <label>DURATION OF THE INTERVENTION</label>
            <div className={styles.row}>
              <span>Start date and time:</span>
              <input
                type="date"
                name="startDateTime"
                value={formData.startDateTime}
                onChange={handleChange}
              />
              <span>End date and time:</span>
              <input
                type="date"
                name="endDateTime"
                value={formData.endDateTime}
                onChange={handleChange}
              />
            </div>
            <div className={styles.row}>
              <span>PLACE OF THE INTERVENTION Area:</span>
              <input
                name="placeArea"
                value={formData.placeArea}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.section}>
            <label>NATURE OF THE WORKS</label>
            <input
              className={styles.fullWidthInput}
              name="natureOfWorks"
              value={formData.natureOfWorks}
              onChange={handleChange}
            />
          </div>

          <div className={styles.section}>
            <label>TOOLS USED</label>
            <div className={styles.grid}>
              {tools.map((tool, i) => (
                <label key={i} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.toolsUsed.includes(tool)}
                    onChange={() => handleCheckboxChange(tool)}
                  />
                  {tool}
                </label>
              ))}
              <label className={styles.checkboxLabel}>
                OTHER:{" "}
                <input
                  type="text"
                  name="otherTool"
                  value={formData.otherTool}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className={styles.section}>
            <label>Personnel Protection Equipment</label>
            <ImageCheckboxGrid />
          </div>

          <div className={styles.section}>
            <label>EQUIPMENT OF STRUGGLE AGAINST THE FIRE</label>
            <EquipementAgainFire />
          </div>

          <div className={styles.section}>
            <h2 className={styles.title}>
              REQUIREMENTS SECURITY AND ENVIRONMENT HAS RESPECT
            </h2>
            <ul className={styles.list}>
              <li>Mark the work area clearly.</li>
              <li>Always work in pairs in isolated areas.</li>
              <li>
                For any work at height, use scaffolding, guardrails, safety
                harnesses, and obtain a height work permit.
              </li>
              <li>
                Immediately turn off the machine if you are disturbed by other
                people entering your work area.
              </li>
              <li>
                Ensure there are no obstacles, such as screws, on the part to be
                worked on. Remove them.
              </li>
              <li>Respect pedestrian and vehicle traffic routes.</li>
              <li>
                Make sure you are physically and mentally fit to perform the
                work.
              </li>
              <li>Maintain order and cleanliness at your workstation.</li>
              <li>Ensure that the product is not damaged.</li>
              <li>
                Verify that safety devices and accessories are properly secured.
              </li>
              <li>Check the power cable and plug.</li>
              <li>
                Ensure that the work equipment is compliant and in good
                condition.
              </li>
              <li>
                The worksite must be inspected and confirmed suitable for the
                task.
              </li>
              <li>
                Use electrical sources appropriate for the task to be performed.
              </li>
              <li>
                Personal protective equipment must be provided and appropriate
                for the task.
              </li>
            </ul>
          </div>

          <div className={styles.gridTwoCol}>
            <div className={styles.gridTwoCol_1}>
              <label style={{ textWrap: "nowrap" }}>
                OTHERS REQUIREMENTS SECURITY:
              </label>
              <br />
              <textarea
                className={styles.textarea}
                rows="3"
                placeholder=".........................................................................................................................................................."
                name="otherRequirements"
                value={formData.otherRequirements}
                onChange={handleChange}
              />
            </div>

            <div className={styles.gridTwoCol_2}>
              <div>
                <label>
                  <strong>Engineering Manager:</strong>
                  <input
                    name="engineerManager"
                    value={formData.engineerManager}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  <strong>HSE OFFICER:</strong>
                  <input
                    name="hseOfficer"
                    value={formData.hseOfficer}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <label>
                <strong>Job of Guard:</strong>
                <input
                  name="guardJob"
                  value={formData.guardJob}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className={styles.gridTwoCol} style={{ display: "flex" }}>
            <div className={styles.section}>
              <h3 className={styles.title}>
                INSPECTION OF THE PLACES OF THE WORK
              </h3>
              <p className={styles.inlineParagraph}>
                Joint inspection of the places of work, of the installation and
                of material took place the
                <input
                  type="date"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleChange}
                  className={styles.inlineInput}
                />
                at
                <span className={styles.underline}>Park M</span>,
                <input
                  type="text"
                  name="inspectionPlace"
                  value={formData.inspectionPlace}
                  onChange={handleChange}
                  className={styles.inlineInput}
                  placeholder="Place"
                />
                . The sector intervention has summer delimited, the ways of
                traffic of the people and equipment indicated.
              </p>
            </div>
            <div className={styles.gridTwoCol_2}>
              <div className={styles.signatureTitle}>
                COORDINATOR OF THE WORKS
              </div>
              <p>(Date And signature)</p>
              <input
                type="text"
                className={styles.input}
                name="coordinatorSignature"
                value={formData.coordinatorSignature}
                onChange={handleChange}
              />
            </div>
            <div className={styles.gridTwoCol_2}>
              <div className={styles.signatureTitle}>RESPONSIBLE HSE</div>
              <p>(Date And signature)</p>
              <input
                type="text"
                className={styles.input}
                name="responsibleSignature"
                value={formData.responsibleSignature}
                onChange={handleChange}
              />
            </div>
          </div>
          <button onClick={handleAddWorkPermit} className={styles.saveButton}>
            enregister workpermit {formData.toolsUsed}
          </button>
        </div>
      )}

      {formData.toolsUsed.includes(tools[3]) ? <HotWorkPermitForm /> : null}
    </>
  );
};

export default WorkPermit;
