import React from "react";
import { FiCheck, FiX, FiMinus } from "react-icons/fi";

const ViewHotWork = ({ hotWorkData }) => {
  if (!hotWorkData) return null;

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

  const renderAnswerIcon = (answer) => {
    switch (answer) {
      case "YES":
        return <FiCheck className="text-green-500" />;
      case "NO":
        return <FiX className="text-red-500" />;
      case "N/A":
        return <FiMinus className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-yellow-200 mt-[10vh]">
      <h2 className="text-xl font-bold mb-4 text-center bg-yellow-100 py-2 rounded">
        HOT WORK PERMIT DETAILS
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Basic Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {hotWorkData.name || "N/A"}
            </p>
            <p>
              <span className="font-medium">Job Details:</span>{" "}
              {hotWorkData.jobDetails || "N/A"}
            </p>
            <p>
              <span className="font-medium">Tools:</span>{" "}
              {hotWorkData.tools || "N/A"}
            </p>
            <p>
              <span className="font-medium">Location:</span>{" "}
              {hotWorkData.location || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Approval Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Approved By:</span>{" "}
              {hotWorkData.approvalBy || "N/A"}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {hotWorkData.approvalDate || "N/A"}
            </p>
            <p>
              <span className="font-medium">Time:</span>{" "}
              {hotWorkData.approvalTime || "N/A"}
            </p>
            <p>
              <span className="font-medium">Valid For:</span>{" "}
              {hotWorkData.hours || "N/A"} hours
            </p>
            <p>
              <span className="font-medium">Shift Day:</span>{" "}
              {hotWorkData.shiftDay || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Safety Questions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Question
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border">
                  Response
                </th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 text-sm text-gray-700 border">
                    {question}
                  </td>
                  <td className="px-4 py-2 text-center border">
                    <div className="flex justify-center">
                      {renderAnswerIcon(hotWorkData.questions?.[index])}
                      <span className="ml-2">
                        {hotWorkData.questions?.[index] || "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Hazards and Precautions</h3>
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <p className="font-medium text-yellow-800">Primary Hazards:</p>
          <p>Fumes, electrics, gases, liquids, radiation, fire, soldering</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Signatures</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">
                  Action
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border">
                  HSE Member
                </th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700 border">
                  Worker
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="px-4 py-2 text-sm text-gray-700 border">
                  Signature Before Operation
                </td>
                <td className="px-4 py-2 text-center border">-</td>
                <td className="px-4 py-2 text-center border">-</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700 border">
                  Signature After Operation
                </td>
                <td className="px-4 py-2 text-center border">-</td>
                <td className="px-4 py-2 text-center border">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewHotWork;
