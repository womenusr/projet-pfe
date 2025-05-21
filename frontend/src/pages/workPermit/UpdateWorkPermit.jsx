import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ImageCheckboxGrid from "../../components/common/ImageCheckboxGrid";
import EquipementAgainFire from "../../components/common/EquipementAgainFire";
import UpdateHotWork from "../FirePermit/UpdateHotWork";
import {
  getWorkPermitById,
  updateWorkPermit,
} from "../../services/workPermitServices";
import {
  FiSave,
  FiUser,
  FiCalendar,
  FiTool,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
  FiChevronLeft,
} from "react-icons/fi";
import { FaSignature, FaIdCard } from "react-icons/fa";
import { HiOutlineFire } from "react-icons/hi";

const WorkPermitUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotWork, setHotWork] = useState({});
  const [displayHotWork, setDisplayHotWork] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const tools = [
    "Cutting tool",
    "Drilling tool",
    "Chemical substances",
    "Hot working tools (cutting, welding...)",
    "Live electrical equipment",
    "Working at height equipment",
    "Lifting equipment",
  ];

  const safetyRequirements = [
    "Mark the work area clearly.",
    "Always work in pairs in isolated areas.",
    "For any work at height, use scaffolding, guardrails, safety harnesses, and obtain a height work permit.",
    "Immediately turn off the machine if you are disturbed by other people entering your work area.",
    "Ensure there are no obstacles, such as screws, on the part to be worked on. Remove them.",
    "Respect pedestrian and vehicle traffic routes.",
    "Make sure you are physically and mentally fit to perform the work.",
    "Maintain order and cleanliness at your workstation.",
    "Ensure that the product is not damaged.",
    "Verify that safety devices and accessories are properly secured.",
    "Check the power cable and plug.",
    "Ensure that the work equipment is compliant and in good condition.",
    "The worksite must be inspected and confirmed suitable for the task.",
    "Use electrical sources appropriate for the task to be performed.",
    "Personal protective equipment must be provided and appropriate for the task.",
  ];

  useEffect(() => {
    const fetchWorkPermit = async () => {
      try {
        const response = await getWorkPermitById(id);
        const data = response;

        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toISOString().split("T")[0];
        };

        setFormData({
          ...data,
          startDateTime: formatDate(data.startDateTime),
          endDateTime: formatDate(data.endDateTime),
          inspectionDate: formatDate(data.inspectionDate),
          persons:
            data.persons.length >= 2
              ? data.persons
              : [
                  ...data.persons,
                  ...Array(2 - data.persons.length).fill({
                    name: "",
                    position: "",
                    cin: "",
                    signature: "",
                  }),
                ],
        });

        if (data.hot_work_id?._id) {
          setHotWork(data.hot_work_id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching work permit:", error);
        setLoading(false);
      }
    };

    fetchWorkPermit();
  }, [id]);

  useEffect(() => {
    if (formData.toolsUsed.includes(tools[3])) {
      setDisplayHotWork(true);
    }
  }, [formData.toolsUsed]);

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

  const handleUpdateWorkPermit = async () => {
    try {
      delete formData.hot_work_id;
      const sendData =
        Object.keys(hotWork).length > 0
          ? { ...formData, hotWork: hotWork }
          : formData;

      await updateWorkPermit(id, sendData);
      // Add success notification here
      navigate(-1); // Go back after successful update
    } catch (error) {
      console.error("Error updating work permit:", error);
      // Add error notification here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {!displayHotWork ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiChevronLeft className="mr-1" /> Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Edit Work Permit
            </h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          {hotWork?._id && (
            <div className="mb-6 flex justify-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setDisplayHotWork(true)}
              >
                <HiOutlineFire className="mr-2" /> Edit Hot Work Permit
              </button>
            </div>
          )}

          {/* Work Coordinator Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiUser className="mr-2" /> WORK COORDINATOR
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Mr/Mrs)
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter name"
                  name="coordinatorName"
                  value={formData.coordinatorName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="coordinatorPosition"
                  value={formData.coordinatorPosition}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Company Speaker Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiUser className="mr-2" /> COMPANY SPEAKER
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Mr/Mrs)
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="speakerName"
                  value={formData.speakerName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="speakerPosition"
                  value={formData.speakerPosition}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaIdCard className="mr-1" /> CIN
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="speakerCIN"
                  value={formData.speakerCIN}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaSignature className="mr-1" /> Signature
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="speakerSignature"
                  value={formData.speakerSignature}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accompanying persons (number)
              </label>
              <input
                className="w-full md:w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="accompanyingNumber"
                value={formData.accompanyingNumber}
                onChange={handleChange}
              />
            </div>

            <h3 className="text-md font-medium text-gray-700 mb-3">
              Accompanying Persons Details
            </h3>
            {formData.persons.map((person, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded border"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name (Mr/Mrs)
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={person.name}
                    onChange={(e) =>
                      handlePersonChange(i, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={person.position}
                    onChange={(e) =>
                      handlePersonChange(i, "position", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIN
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={person.cin}
                    onChange={(e) =>
                      handlePersonChange(i, "cin", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Signature
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={person.signature}
                    onChange={(e) =>
                      handlePersonChange(i, "signature", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Duration and Location Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiCalendar className="mr-2" /> DURATION AND LOCATION OF
              INTERVENTION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start date and time
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End date and time
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place of intervention (Area)
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="placeArea"
                value={formData.placeArea}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Nature of Works Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              NATURE OF THE WORKS
            </h2>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              name="natureOfWorks"
              value={formData.natureOfWorks}
              onChange={handleChange}
              placeholder="Describe the nature of the works..."
            />
          </div>

          {/* Tools Used Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiTool className="mr-2" /> TOOLS USED
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {tools.map((tool, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.toolsUsed.includes(tool)}
                    onChange={() => handleCheckboxChange(tool)}
                  />
                  <span className="text-sm text-gray-700">{tool}</span>
                </label>
              ))}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other tools (specify)
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="otherTool"
                value={formData.otherTool}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Equipment Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                PERSONAL PROTECTION EQUIPMENT
              </h2>
              <ImageCheckboxGrid />
            </div>
            <div className="p-4 border rounded-lg bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                EQUIPMENT AGAINST FIRE
              </h2>
              <EquipementAgainFire />
            </div>
          </div>

          {/* Safety Requirements Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiAlertTriangle className="mr-2 text-yellow-600" /> SECURITY AND
              ENVIRONMENT REQUIREMENTS
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              {safetyRequirements.map((requirement, i) => (
                <li key={i}>{requirement}</li>
              ))}
            </ul>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other security requirements
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                rows="3"
                placeholder="Enter any additional security requirements..."
                name="otherRequirements"
                value={formData.otherRequirements}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Inspection and Signatures Section */}
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              INSPECTION AND APPROVALS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engineering Manager
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="engineerManager"
                  value={formData.engineerManager}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HSE OFFICER
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="hseOfficer"
                  value={formData.hseOfficer}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job of Guard
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="guardJob"
                value={formData.guardJob}
                onChange={handleChange}
              />
            </div>

            <div className="mb-6 p-3 bg-white rounded border">
              <p className="text-sm text-gray-700 mb-3">
                Joint inspection of the places of work, of the installation and
                of material took place on
                <input
                  type="date"
                  className="mx-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleChange}
                />
                at
                <span className="mx-1 font-medium">Park M</span>,
                <input
                  type="text"
                  className="ml-2 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="inspectionPlace"
                  value={formData.inspectionPlace}
                  onChange={handleChange}
                  placeholder="Enter place"
                />
                . The sector intervention has been delimited, the ways of
                traffic of the people and equipment indicated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  COORDINATOR OF THE WORKS
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  (Date and signature)
                </p>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="coordinatorSignature"
                  value={formData.coordinatorSignature}
                  onChange={handleChange}
                />
              </div>
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-2">
                  RESPONSIBLE HSE
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  (Date and signature)
                </p>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="responsibleSignature"
                  value={formData.responsibleSignature}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="mr-2" /> Cancel
            </button>
            <button
              onClick={handleUpdateWorkPermit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSave className="mr-2" /> Update Work Permit
            </button>
          </div>
        </div>
      ) : (
        <UpdateHotWork
          setDisplayHotWork={setDisplayHotWork}
          setHotWork={setHotWork}
          initialData={hotWork}
        />
      )}
    </div>
  );
};

export default WorkPermitUpdate;
