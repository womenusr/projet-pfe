import React, { useEffect, useState } from "react";
import {
  getAllWorkPermits,
  updateWorkPermit,
} from "../../services/workPermitServices";
import { useNavigate } from "react-router";
import { FaPen } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const WorkPermitTable = ({ workPermits }) => {
  const navigate = useNavigate();
  const [briefing, setBriefing] = useState({
    status: "",
    description: "",
  });
  const [Displaybriefing, setDisplayBriefing] = useState(false);
  const [currentPermit, setCurrentPermit] = useState(null);
  const handleChangeWorkPermitStatusStatus = async (e, id) => {
    let newPermitStatus = e.target.value;

    await updateWorkPermit(id, { status: newPermitStatus });
  };

  const handleBriefingModal = (permit) => {
    setCurrentPermit(permit);
    if (permit.briefing && permit.briefing._id) {
      setBriefing(permit.briefing);
    }

    setDisplayBriefing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBriefing((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBriefing = async (e) => {
    e.preventDefault();
    await updateWorkPermit(currentPermit._id, { briefing: briefing });
  };

  return (
    <>
      {Displaybriefing && (
        <div>
          {" "}
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={briefing.status}
              onChange={handleChange}
              required
              className="border rounded p-2 w-full"
            >
              <option value="">Select a status</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
              <option value="reluctantly">Reluctantly</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={briefing.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            onClick={handleUpdateBriefing}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Briefing
          </button>
          <button
            onClick={() => setDisplayBriefing(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      )}

      {!Displaybriefing && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4">Permit #</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Intervention</th>
                <th className="py-3 px-4">Coordinator</th>
                <th className="py-3 px-4">Speaker</th>
                <th className="py-3 px-4">Start</th>
                <th className="py-3 px-4">End</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Operation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Briefing</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workPermits.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No work permits found.
                  </td>
                </tr>
              ) : (
                workPermits.map((permit) => (
                  <tr
                    key={permit._id}
                    className="border-b hover:bg-gray-50 transition duration-200 text-sm"
                  >
                    <td className="py-3 px-4">{permit.numero}</td>
                    <td className="py-3 px-4">{permit.location}</td>
                    <td className="py-3 px-4">{permit.intervention}</td>
                    <td className="py-3 px-4">
                      {permit.coordinatorName} <br />
                      <span className="text-xs text-gray-500">
                        {permit.coordinatorPosition}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {permit.speakerName} <br />
                      <span className="text-xs text-gray-500">
                        {permit.speakerPosition}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(permit.startDateTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(permit.endDateTime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{permit.placeArea}</td>
                    <td className="py-3 px-4">
                      {permit.toolsUsed && permit.toolsUsed.join(", ")}
                    </td>
                    <td className=" text-gray-900">
                      <select
                        onChange={(e) =>
                          handleChangeWorkPermitStatusStatus(e, permit._id)
                        }
                        className={
                          permit.status === "pending"
                            ? "px-2 py-4 rounded bg-orange-500"
                            : permit.status === "rejected"
                            ? "px-2 py-4 rounded  bg-red-600"
                            : "px-2 py-4 rounded  bg-green-600"
                        }
                      >
                        <option
                          className={
                            permit.status === "pending"
                              ? "px-2 py-4 rounded  bg-orange-500"
                              : permit.status === "rejected"
                              ? "px-2 py-4 rounded  bg-red-600"
                              : "px-2 py-4 rounded  bg-green-600"
                          }
                          defaultChecked
                          value={permit.status}
                        >
                          {permit.status}
                        </option>
                        {["rejected", "pending", "approved"]
                          .filter((el) => el != permit.status)
                          .map((el) => {
                            return (
                              <option
                                className={
                                  el === "pending"
                                    ? "px-2 py-4 rounded  bg-orange-500"
                                    : el === "rejected"
                                    ? "px-2 py-4 rounded  bg-red-600"
                                    : "px-2 py-4 rounded  bg-green-600"
                                }
                                value={el}
                              >
                                {el}
                              </option>
                            );
                          })}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <FiEye
                        size={25}
                        onClick={() => handleBriefingModal(permit)}
                        color="blue"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:underline mr-2">
                        View
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/update-work-permit/${permit._id}`)
                        }
                        className="text-green-600 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

function WorkPermitManagement() {
  const [workPermits, setWorkPermits] = useState([]);
  useEffect(() => {
    getAllWorkPermits().then((res) => {
      setWorkPermits(res);
    });
  }, []);
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Work Permits</h1>
      <div className="flex flex-row  justify-end mb-5">
        <button
          onClick={() => navigate("/work-permit")}
          className="bg-green-600 px-2 py-4 rounded text-white"
        >
          ajouter un permit de travail{" "}
        </button>
      </div>

      <WorkPermitTable workPermits={workPermits} />
    </div>
  );
}

export default WorkPermitManagement;
