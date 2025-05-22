import React from "react";
import styles from "./ImageCheckboxGrid.module.css";

const ImageCheckboxGrid = ({ toolsUsed }) => {
  const imageNames = [
    "01.jpg",
    "02.jpg",
    "03.jpg",
    "04.jpg",
    "05.jpg",
    "06.jpg",
    "07.jpg",
    "08.jpg",
  ];

  const tools = {
    "Cutting tool": [1, 4, 7],
    "Drilling tool": [1, 4],
    "Chemical substances": [1, 2, 4, 7],
    "hot working tools (cutting , welding ...)": [1, 2, 4, 5, 7],
    "Live electrical equipment": [1, 4, 7],
    "Working at height equipment": [1, 3, 6, 8],
    "Lifting equipment": [1, 3, 7, 8],
  };

  // Create a set of all image indexes that should be checked
  const getCheckedImages = () => {
    const checkedImages = new Set();

    if (!toolsUsed) return checkedImages;

    toolsUsed.forEach((toolName) => {
      const imageIndexes = tools[toolName];
      if (imageIndexes) {
        imageIndexes.forEach((index) => {
          // Convert to 0-based index if your numbers are 1-based
          checkedImages.add(index - 1);
        });
      }
    });

    return checkedImages;
  };

  const checkedImages = getCheckedImages();

  return (
    <div className={styles.grid}>
      {imageNames.map((image, i) => (
        <div key={i} className={styles.imageItem}>
          <img
            src={`/${image}`}
            alt={`icon ${i + 1}`}
            className={styles.icon}
          />
          <input
            type="checkbox"
            checked={checkedImages.has(i)}
            readOnly // Since this is just for display
          />
        </div>
      ))}
    </div>
  );
};

export default ImageCheckboxGrid;
