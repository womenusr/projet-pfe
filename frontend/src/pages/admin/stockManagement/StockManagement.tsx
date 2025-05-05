import React, { useEffect, useState } from "react";
import stockServices from "../../../services/stockServices.js";

interface Stock {
  _id?: string;
  product_name: string;
  quantity: number;
}

const StockManagement: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState<Stock>({
    product_name: "",
    quantity: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleGetStocks = async () => {
    const result = await stockServices.fetchStocks();
    setStocks(result);
  };

  useEffect(() => {
    handleGetStocks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentStock({ ...currentStock, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setCurrentStock({ product_name: "", quantity: 0 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (stock: Stock) => {
    setCurrentStock(stock);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentStock._id) {
      await stockServices.updateStock(currentStock._id, currentStock);
    } else {
      await stockServices.addStock(currentStock);
    }
    setIsModalOpen(false);
    await handleGetStocks();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await stockServices.deleteStock(id);
      await handleGetStocks();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Manager</h1>
        <button
          onClick={openAddModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Product Name</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id} className="text-center">
              <td className="py-2 px-4 border">{stock.product_name}</td>
              <td className="py-2 px-4 border">{stock.quantity}</td>
              <td className="py-2 px-4 border space-x-2">
                <button
                  onClick={() => openEditModal(stock)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stock._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={currentStock.product_name}
                  onChange={handleInputChange}
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={currentStock.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
