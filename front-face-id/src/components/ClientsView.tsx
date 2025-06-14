import { UserPlus } from "lucide-react";
import type { AppView, Client } from "../types";

interface ClientsViewProps {
  clients: Client[];
  setCurrentView: (view: AppView) => void;
  error?: string | null;
}

export const ClientsView = ({
  clients,
  setCurrentView,
  error,
}: ClientsViewProps) => (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          👥 Gestión de Clientes
        </h1>
        <button
          onClick={() => setCurrentView("register")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <UserPlus size={20} />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client: Client) => (
          <div key={client.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  client.active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {client.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="text-gray-600 mb-2">📧 {client.email}</p>
            <p className="text-gray-600 mb-2">
              📅 Vence: {client.expiration_date}
            </p>
            <p className="text-gray-600">
              🔒 Rostro:{" "}
              {client.has_face ? "✅ Registrado" : "❌ No registrado"}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
