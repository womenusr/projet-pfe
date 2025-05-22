import React from "react";
import styles from "./ImageCheckboxGrid.module.css";

const EquipementAgainFire = ({ toolsUsed }) => {
  const imageNames = ["ext-co2.jpg", "ext-abc.jpg"];
  console.log(toolsUsed);
  const tools = [
    "Chemical substances",
    "hot working tools (cutting , welding ...)",
    "Live electrical equipment",
  ];

  const shouldCheckAll =
    toolsUsed &&
    toolsUsed.some((tool) =>
      tools.map((t) => t.toLowerCase()).includes(tool.toLowerCase())
    );

  return (
    <div className={styles.grid}>
      {imageNames.map((image, i) => (
        <div key={i} className={styles.imageItem}>
          <img
            src={`/${image}`}
            alt={
              image.includes("co2") ? "CO2 Extinguisher" : "ABC Extinguisher"
            }
            className={styles.icon}
          />
          <input type="checkbox" checked={shouldCheckAll} readOnly />
        </div>
      ))}
    </div>
  );
};

export default EquipementAgainFire;
