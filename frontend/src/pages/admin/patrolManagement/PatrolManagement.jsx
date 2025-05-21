import React, { useEffect, useMemo, useState } from "react";
import patrolServices from "../../../services/patrolServices";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiMessageSquare,
} from "react-icons/fi";

const PatrolManagement = () => {
  // Patrol types
  const patrolTypes = [
    "Daily Patrol",
    "Management Patrol",
    "Conversation Type Patrol",
    "kizuki Patrol",
  ];

  // Sample initial data

  const [patrols, setPatrols] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatrol, setCurrentPatrol] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState({
    photosBefore: [],
    photosAfter: [],
  });
  const itemsPerPage = 5;

  // Form state

  const filteredPatrols = useMemo(() => {
    let filtered =
      activeTab === "All"
        ? patrols
        : patrols.filter((patrol) => patrol.type === activeTab);

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((patrol) => {
        return (
          patrol.type?.toLowerCase().includes(term) ||
          patrol.number?.toString().toLowerCase().includes(term) ||
          patrol.item?.toLowerCase().includes(term) ||
          patrol.area?.toLowerCase().includes(term) ||
          patrol.personInCharge?.toLowerCase().includes(term) ||
          patrol.solution?.toLowerCase().includes(term) ||
          patrol.personInChargeComment?.toLowerCase().includes(term) ||
          patrol.participants?.some(
            (p) =>
              p.name?.toLowerCase().includes(term) ||
              p.matricule?.toLowerCase().includes(term)
          ) ||
          patrol.status?.toLowerCase().includes(term)
        );
      });
    }

    return filtered;
  }, [patrols, activeTab, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const [formData, setFormData] = useState({
    type: patrolTypes[0],
    number: "",
    item: "",
    solution: "",
    area: "",
    personInCharge: "",
    dueDate: "",
    progress: 0,
    photosBefore: [],
    photosAfter: [],
    confirmation: false,
    participants: [],
    personInChargeComment: "",
    newParticipant: { name: "", matricule: "" },
  });

  useEffect(() => {
    const fetchPatrols = async () => {
      try {
        const patrols = await patrolServices.getAllPatrols();
        setPatrols(patrols);
        setFormData({ ...formData, number: patrols?.length + 1 });
      } catch (err) {
        console.error("Failed to fetch patrols:", err);
      }
    };
    fetchPatrols();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleStatusChange = async (new_status, id) => {
    let res = await patrolServices.updatePatrolStatus(id, {
      status: new_status,
    });
    console.log(res);
    patrolServices.getAllPatrols().then((result) => {
      setPatrols(result);
    });
    toast.success("status updated succesfully ! ");
  };

  // Handle multiple image uploads
  const handleImageUpload = (e, fieldName) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const newImages = files.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...files], // Keep existing URLs
      }));

      setImagePreview((prev) => ({
        ...prev,
        [fieldName]: [...prev[fieldName], ...newImages],
      }));
    }
  };

  // Remove an image from preview
  const removeImage = (fieldName, index) => {
    setImagePreview((prev) => {
      const updated = [...prev[fieldName]];
      updated.splice(index, 1);
      return { ...prev, [fieldName]: updated };
    });

    if (isEditMode) {
      setFormData((prev) => {
        const updated = [...prev[fieldName]];
        updated.splice(index, 1);
        return { ...prev, [fieldName]: updated };
      });
    }
  };

  // Open modal for adding new patrol
  const openAddModal = () => {
    setFormData({ ...formData, number: patrols.length + 1 });
    setFormData({
      ...formData,
      type: patrolTypes[0],
      item: "",
      solution: "",
      area: "",
      personInCharge: "",
      dueDate: "",
      progress: 0,
      photosBefore: [],
      photosAfter: [],
      confirmation: false,
    });
    setImagePreview({
      photosBefore: [],
      photosAfter: [],
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Open modal for editing patrol
  const openEditModal = (patrol) => {
    setFormData({
      ...patrol,
      progress: parseInt(patrol.progress),
    });
    setImagePreview({
      photosBefore: patrol.photosBefore || [],
      photosAfter: patrol.photosAfter || [],
    });
    setCurrentPatrol(patrol);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPatrol(null);
    setImagePreview({
      photosBefore: [],
      photosAfter: [],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append files to FormData
      formData.photosBefore.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("photosBefore", file);
        }
      });

      formData.photosAfter.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("photosAfter", file);
        }
      });

      // Append other data as JSON
      const { photosBefore, photosAfter, ...rest } = formData;
      formDataToSend.append("data", JSON.stringify(rest));

      // Debug: Show what's being sent
      console.log("--- FormData Contents ---");
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `[File] ${value.name} (${value.size} bytes)`);
        } else {
          console.log(key, value);
        }
      }

      if (isEditMode) {
        await patrolServices.updatePatrol(currentPatrol._id, formDataToSend);
        await patrolServices.updatePatrolStatus(currentPatrol._id, {
          status: "ongoing",
        });
      } else {
        await patrolServices.createPatrol(formDataToSend);
      }

      // Refresh data
      const patrols = await patrolServices.getAllPatrols();
      setPatrols(patrols);
      closeModal();
    } catch (err) {
      console.error("Error saving patrol:", err);
    }
  };

  const deletePatrol = async (id) => {
    try {
      await patrolServices.deletePatrol(id);
      patrolServices.getAllPatrols().then((result) => {
        setPatrols(result);
      });
    } catch (err) {
      console.error("Failed to delete patrol:", err);
    }
  };

  // Toggle confirmation status
  const toggleConfirmation = (id) => {
    setPatrols(
      patrols.map((patrol) =>
        patrol.id === id
          ? { ...patrol, confirmation: !patrol.confirmation }
          : patrol
      )
    );
  };

  // Filter patrols by type

  // Pagination logic
  const totalPages = Math.ceil(filteredPatrols.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPatrols.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Image gallery modal state
  const [galleryModal, setGalleryModal] = useState({
    isOpen: false,
    images: [],
    title: "",
  });

  // Open image gallery
  const openGallery = (images, title) => {
    setGalleryModal({
      isOpen: true,
      images,
      title,
    });
  };

  const handleParticipantInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      newParticipant: {
        ...prev.newParticipant,
        [name]: value,
      },
    }));
  };

  const addParticipant = () => {
    if (formData.newParticipant.name && formData.newParticipant.matricule) {
      setFormData((prev) => {
        // Ensure participants is always an array
        const currentParticipants = Array.isArray(prev.participants)
          ? prev.participants
          : [];

        return {
          ...prev,
          participants: [...currentParticipants, prev.newParticipant],
          newParticipant: { name: "", matricule: "" }, // Reset after adding
        };
      });
    }
  };

  const removeParticipant = (index) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Patrol Management
      </h1>
      <div className="mb-6 relative">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
          <input
            type="text"
            placeholder="Search patrols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 focus:outline-none"
          />
          <div className="px-3 py-2 bg-gray-100 border-l border-gray-300">
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-5 h-5" />
              </button>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
        {searchTerm && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-b-lg border border-gray-200 px-4 py-2 text-sm text-gray-600">
            Searching in: Type, Number, Item, Area, Person in Charge, Solution,
            Comments, Participants, Status
          </div>
        )}
      </div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab("All");
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === "All"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All Patrols
        </button>
        {patrolTypes.map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveTab(type);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Add Patrol Button */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> Add New Patrol
        </button>
        <div className="text-sm text-gray-600">
          {filteredPatrols.length}{" "}
          {filteredPatrols.length === 1 ? "result" : "results"} found
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      {/* Patrols Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Non-Conformité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person in Charge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((patrol) => (
                  <tr
                    key={patrol.id}
                    className={patrol.confirmation ? "bg-green-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patrol.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patrol.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patrol.item}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patrol.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patrol.personInCharge}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patrol.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {patrol.participants &&
                          patrol.participants.map((participant, index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium">
                                {participant.name}
                              </span>
                              <span className="text-gray-500 ml-1">
                                ({participant.matricule})
                              </span>
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            patrol.progress < 30
                              ? "bg-red-500"
                              : patrol.progress < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${patrol.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {patrol.progress}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {patrol.photosBefore &&
                          patrol.photosBefore.length > 0 && (
                            <button
                              onClick={() =>
                                openGallery(
                                  patrol.photosBefore,
                                  "Before Photos"
                                )
                              }
                              className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              <FiImage /> Before ({patrol.photosBefore.length})
                            </button>
                          )}
                        {patrol.photosAfter &&
                          patrol.photosAfter.length > 0 && (
                            <button
                              onClick={() =>
                                openGallery(patrol.photosAfter, "After Photos")
                              }
                              className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                            >
                              <FiImage /> After ({patrol.photosAfter.length})
                            </button>
                          )}
                      </div>
                    </td>

                    <td className=" whitespace-nowrap">
                      <select
                        id="status"
                        name="status"
                        value={patrol.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value, patrol._id)
                        } // Ajoute cette fonction si tu veux capturer le changement
                        className={`
      block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2
      ${
        patrol.status === "open"
          ? "bg-red-100 text-red-800 border-red-300 focus:ring-red-500 focus:border-red-500"
          : patrol.status === "ongoing"
          ? "bg-orange-100 text-orange-800 border-orange-300 focus:ring-orange-500 focus:border-orange-500"
          : "bg-green-100 text-green-800 border-green-300 focus:ring-green-500 focus:border-green-500"
      }
    `}
                      >
                        <option value="open">Open</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(patrol)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => deletePatrol(patrol._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          onClick={() => toggleConfirmation(patrol._id)}
                          className={`p-1 rounded-full ${
                            patrol.confirmation
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {patrol.confirmation ? <FiCheck /> : <FiX />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No patrols found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPatrols.length > itemsPerPage && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiChevronLeft /> Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === number
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() =>
                paginate(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Patrol Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditMode ? "Edit Patrol" : "Add New Patrol"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patrol Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patrol Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {patrolTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Participants
                  </label>

                  {/* Current participants list */}
                  <div className="mb-3 space-y-2">
                    {formData.participants &&
                      formData.participants.length > 0 &&
                      formData.participants.map((participant, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded"
                        >
                          <span className="flex-1">
                            {participant.name} ({participant.matricule})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeParticipant(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Add new participant form */}
                  <div className="flex gap-2 mb-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="name"
                        value={formData.newParticipant?.name}
                        onChange={handleParticipantInputChange}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name="matricule"
                        value={formData.newParticipant?.matricule}
                        onChange={handleParticipantInputChange}
                        placeholder="Matricule"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addParticipant}
                    className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    <FiPlus size={14} /> Add Participant
                  </button>
                </div>
                {/* Non-Conformité Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Non-Conformité Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="NC-001"
                    required
                  />
                </div>

                {/* Item */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <input
                    type="text"
                    name="item"
                    value={formData.item}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description of the issue"
                    required
                  />
                </div>

                {/* Solution */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solution
                  </label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Proposed solution"
                    required
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Location/Area"
                    required
                  />
                </div>

                {/* Person in Charge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Person in Charge
                  </label>
                  <input
                    type="text"
                    name="personInCharge"
                    value={formData.personInCharge}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Responsible person"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FiMessageSquare /> Person in Charge Comment
                  </label>
                  <textarea
                    name="personInChargeComment"
                    value={formData.personInChargeComment}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Additional comments from the person in charge"
                  />
                </div>
                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate.length > 0
                        ? new Date(formData.dueDate).toISOString().split("T")[0]
                        : formData.dueDate
                    }
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Progress */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    name="progress"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Photos Before */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos Before
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiCamera className="w-8 h-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">Add photos</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, "photosBefore")}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                    </label>
                    {imagePreview.photosBefore.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-32 h-32 border rounded-lg overflow-hidden"
                      >
                        <img
                          src={
                            photo.includes("uploads")
                              ? "http://localhost:8000" + photo
                              : photo
                          }
                          alt={`Before ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage("photosBefore", index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos After */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photos After
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiCamera className="w-8 h-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">Add photos</p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleImageUpload(e, "photosAfter")}
                        className="hidden"
                        accept="image/*"
                        multiple
                      />
                    </label>
                    {imagePreview.photosAfter.map((photo, index) => (
                      <div
                        key={index}
                        className="relative w-32 h-32 border rounded-lg overflow-hidden"
                      >
                        <img
                          src={
                            photo.includes("uploads")
                              ? "http://localhost:8000" + photo
                              : photo
                          }
                          alt={`After ${index}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeImage("photosAfter", index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirmation */}
                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="confirmation"
                    checked={formData.confirmation}
                    onChange={handleInputChange}
                    id="confirmation"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="confirmation"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Confirmed
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditMode ? "Update Patrol" : "Add Patrol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {galleryModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {galleryModal.title}
              </h2>
              <button
                onClick={() =>
                  setGalleryModal({ isOpen: false, images: [], title: "" })
                }
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryModal.images.map((image, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img
                    src={"http://localhost:8000" + image}
                    alt={`${galleryModal.title} ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrolManagement;
