import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-5xl font-bold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Accès non autorisé
        </h2>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas la permission d'accéder à cette page.
        </p>
        <Link
          to="/"
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition duration-300"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
