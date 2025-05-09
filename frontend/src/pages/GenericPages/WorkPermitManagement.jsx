import React, { useEffect, useState } from "react";
import { getAllWorkPermits } from "../../services/workPermitServices";
import { useNavigate } from "react-router";
const WorkPermitTable = ({ workPermits }) => {
  const navigate = useNavigate();
  return (
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
                <td className="py-3 px-4">{permit.status && permit.status}</td>
                <td className="py-3 px-4">
                  {permit.briefing && permit.briefin}
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
