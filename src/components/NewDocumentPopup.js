import React, { useState } from "react";
import "./Popup.css";

const NewDocumentPopup = ({ onClose, onCreate }) => {
  const [fileName, setFileName] = useState("");

  const handleCreate = () => {
    if (fileName.trim() !== "") {
      onCreate(fileName);
    }
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Create New Document</h2>
        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          className="border-2 border-black border-solid rounded-md"
          onChange={(e) => setFileName(e.target.value)}
        />
        <button className="bg-green-500 text-white" onClick={handleCreate}>
          Create
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default NewDocumentPopup;
