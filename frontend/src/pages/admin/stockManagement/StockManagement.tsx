import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiX,
  FiBox,
  FiDatabase,
} from "react-icons/fi";
import stockServices from "../../../services/stockServices.js";
import { updateStock } from "../../../services/stockServices";

import BonDeSortieModal from "./AddBonSortieModal.jsx";
interface Stock {
  _id?: string;
  product_name: string;
  quantity: number;
  stock_limit: number;
}

const StockManagement: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBonSortieModal, setShowBonSortieModal] = useState(false);
  const [currentStock, setCurrentStock] = useState<Stock>({
    product_name: "",
    quantity: 0,
    stock_limit: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetStocks = async () => {
    const result = await stockServices.fetchStocks();
    setStocks(result);
  };

  useEffect(() => {
    handleGetStocks();
  }, [showBonSortieModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStock({
      ...currentStock,
      [name]:
        name === "quantity"
          ? parseInt(value) || 0
          : name == "stock_limit"
          ? parseInt(value) || 0
          : value,
    });
  };

  const openAddModal = () => {
    setCurrentStock({ product_name: "", quantity: 0, stock_limit: 0 });
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
      await updateStock(currentStock._id, currentStock);
    } else {
      await stockServices.addStock(currentStock);
    }
    setIsModalOpen(false);
    await handleGetStocks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await stockServices.deleteStock(id);
      await handleGetStocks();
    }
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <FiDatabase className="text-blue-600 text-3xl mr-3" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Stock Management
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {filteredStocks.length === 0 ? (
            <div className="p-8 text-center">
              <FiBox className="mx-auto text-4xl text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching products found"
                  : "No products in stock"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search or add a new product"
                  : "Get started by adding your first product"}
              </p>
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-2" />
                Add Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock limit
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStocks.map((stock) => (
                    <tr key={stock._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {stock.product_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            stock.quantity > 10
                              ? "bg-green-100 text-green-800"
                              : stock.quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stock.quantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${"bg-green-100 text-green-800"}`}
                        >
                          {stock.stock_limit} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(stock)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                        >
                          <FiEdit2 className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id!)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStock(stock);
                            setShowBonSortieModal(true);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Bon de sortie
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}

      {showBonSortieModal && (
        <BonDeSortieModal
          setShowBonSortieModal={setShowBonSortieModal}
          currentStock={currentStock}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FiBox className="mr-2 text-blue-500" />
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="product_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="product_name"
                  name="product_name"
                  value={currentStock.product_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="0"
                  value={currentStock.quantity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock limit
                </label>
                <input
                  type="number"
                  id="stock_limit"
                  name="stock_limit"
                  min="0"
                  value={currentStock.stock_limit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter stock limit"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? "Update Product" : "Add Product"}
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
