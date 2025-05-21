import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { updateStock } from "../../../services/stockServices";
import { toast } from "react-toastify";
const departments = [
  "Maintenance LP",
  "Maintenance Assembly",
  "Maintenance Test Électrique",
  "Production Assembly",
  "Production LP",
  "CST",
  "USW",
  "LED Store",
  "Warehouse",
];
const BonDeSortieModal = ({ setShowBonSortieModal, currentStock }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [datePrelevement, setDatePrelevement] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async () => {
    console.log({ selectedDepartment, datePrelevement, quantity });
    await updateStock(currentStock._id, {
      ...currentStock,
      quantity: currentStock.quantity - quantity,
      bonDeSortie: [
        ...currentStock.bonDeSortie,
        {
          departement: selectedDepartment,
          datePrelevement: datePrelevement,
          quantity: quantity,
        },
      ],
    });
    setShowBonSortieModal(false);
    toast.info("bon de sortie creer ! ");
  };

  return (
    <>
      {/* Modal */}
      {true && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">Create Bon de Sortie</h2>
            <div className="mb-4">
              <h4>Produit : {currentStock.product_name}</h4>
            </div>
            <div className="mb-4">
              <h4>quantité restante : {currentStock.quantity}</h4>
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Department</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dep, index) => (
                  <option key={index} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Date de prélèvement
              </label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded-lg"
                value={datePrelevement}
                onChange={(e) => setDatePrelevement(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Quantity</label>
              <input
                type="number"
                min={1}
                max={currentStock.quantity}
                className="w-full border px-3 py-2 rounded-lg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                onClick={() => setShowBonSortieModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BonDeSortieModal;
