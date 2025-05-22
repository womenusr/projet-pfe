import React, { useEffect, useState } from "react";
import {
  deleteHotWorkPermit,
  deleteWorkPermit,
  getAllWorkPermits,
  updateWorkPermit,
} from "../../services/workPermitServices";
import { useNavigate } from "react-router";
import { FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { HiStatusOnline } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import WorkPermitView from "../workPermit/ViewWorkPermit";
import { toast } from "react-toastify";

const WorkPermitTable = ({
  workPermits,
  fetchWorkPermits,
  setDisplaySearchArea,
}) => {
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState({
    status: "",
    description: "",
  });
  const [displayBriefing, setDisplayBriefing] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  const [displayWorkPermitView, setDisplayWorkPermitView] = useState(false);
  const handleChangeWorkPermitStatusStatus = async (e, id) => {
    const newPermitStatus = e.target.value;
    await updateWorkPermit(id, { status: newPermitStatus }).then(() => {
      fetchWorkPermits();
    });
  };

  const handleBriefingModal = (permit) => {
    setCurrentPermit(permit);
    setBriefing(
      permit.briefing && permit.briefing._id
        ? permit.briefing
        : {
            status: "",
            description: "",
          }
    );
    setDisplayBriefing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBriefing((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBriefing = async (e) => {
    e.preventDefault();
    await updateWorkPermit(currentPermit._id, { briefing: briefing });
    setDisplayBriefing(false);
  };

  const handleDeleteWorkPermit = async (permit) => {
    try {
      await deleteWorkPermit(permit._id);

      if (permit.hot_work_id) {
        await deleteHotWorkPermit(permit.hot_work_id);
      }

      toast.success("Work permit deleted successfully.");
    } catch (error) {
      console.error("Error deleting work permit:", error);
      toast.error("Failed to delete work permit.");
    } finally {
      fetchWorkPermits();
    }
  };

  return (
    <>
      {displayWorkPermitView && (
        <WorkPermitView
          data={currentPermit}
          setDisplayWorkPermitView={setDisplayWorkPermitView}
          setDisplaySearchArea={setDisplaySearchArea}
        />
      )}

      {/* Briefing Modal */}
      {displayBriefing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Work Permit Briefing</h3>
              <button
                onClick={() => setDisplayBriefing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={briefing.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a status</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                  <option value="reluctantly">Reluctantly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={briefing.description}
                  onChange={handleChange}
                  placeholder="Enter briefing description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-4 border-t">
              <button
                onClick={() => setDisplayBriefing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateBriefing}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Briefing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Permits Table */}
      {!displayBriefing && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Permit #
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Company
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Coordinator
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Start
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    End
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Area
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Operation
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Briefing
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workPermits.length === 0 ? (
                  <tr>
                    <td
                      colSpan="12"
                      className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                    >
                      No work permits found.
                    </td>
                  </tr>
                ) : (
                  workPermits.map((permit) => (
                    <tr
                      key={permit._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permit.numero}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {permit.intervention}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {permit.coordinatorName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {permit.coordinatorPosition}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {
                          new Date(permit.startDateTime)
                            .toLocaleString()
                            .split(" ")[0]
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {
                          new Date(permit.endDateTime)
                            .toLocaleString()
                            .split(" ")[0]
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {permit.placeArea}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {permit.toolsUsed && permit.toolsUsed.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          onChange={(e) =>
                            handleChangeWorkPermitStatusStatus(e, permit._id)
                          }
                          value={permit.status}
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            permit.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : permit.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          <option value={permit.status} className="bg-white">
                            {permit.status}
                          </option>
                          {["rejected", "pending", "approved"]
                            .filter((el) => el !== permit.status)
                            .map((el) => (
                              <option key={el} value={el} className="bg-white">
                                {el}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleBriefingModal(permit)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Briefing"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setCurrentPermit(permit);
                              setDisplayWorkPermitView(true);
                              setDisplaySearchArea(false);
                            }}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/update-work-permit/${permit._id}`)
                            }
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Edit"
                          >
                            <FaPen size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                            onClick={() => handleDeleteWorkPermit(permit)}
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

function WorkPermitManagement() {
  const [workPermits, setWorkPermits] = useState([]);
  const [filteredPermits, setFilteredPermits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchField, setSearchField] = useState("numero"); // Champ par défaut
  const [searchText, setSearchText] = useState("");
  const [displaySearchArea, setDisplaySearchArea] = useState(true);
  const navigate = useNavigate();

  const searchFields = [
    { value: "numero", label: "Permit #" },
    { value: "intervention", label: "Company" },
    { value: "coordinatorName", label: "Coordinator Name" },
    { value: "placeArea", label: "Area" },
    { value: "status", label: "Status" },
  ];

  const fetchWorkPermits = async () => {
    try {
      const res = await getAllWorkPermits();
      setWorkPermits(res);
      setFilteredPermits(res);
    } catch (error) {
      console.error("Error fetching work permits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkPermits();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredPermits(workPermits);
    } else {
      const filtered = workPermits.filter((permit) => {
        const fieldValue = permit[searchField]?.toString().toLowerCase() || "";
        return fieldValue.includes(searchText.toLowerCase());
      });
      setFilteredPermits(filtered);
    }
  }, [searchText, searchField, workPermits]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Work Permits Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all work permits in your organization
          </p>
        </div>
        <button
          onClick={() => navigate("/work-permit")}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-2" />
          Add New Work Permit
        </button>
      </div>
      {displaySearchArea && (
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {searchFields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder={`Search by ${
                searchFields.find((f) => f.value === searchField)?.label
              }...`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <MdClose className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      )}{" "}
      {/* Search Bar */}
      <WorkPermitTable
        workPermits={filteredPermits}
        fetchWorkPermits={fetchWorkPermits}
        setDisplaySearchArea={setDisplaySearchArea}
      />
    </div>
  );
}

export default WorkPermitManagement;
