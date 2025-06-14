import { CheckCircle } from "lucide-react";
import { useState } from "react";
import Webcam from "react-webcam";
import ApiService from "../services/api";
import type { AppView, CreateClientForm } from "../types";

interface RegisterViewProps {
  webcamRef: React.RefObject<Webcam | null>;
  videoConstraints: MediaTrackConstraints;
  error?: string | null;
  setError: (error: string | null) => void;
  setCurrentView: (view: AppView) => void;
}

export const RegisterView = ({
  webcamRef,
  videoConstraints,
  error,
  setError,
  setCurrentView,
}: RegisterViewProps) => {
  const [formData, setFormData] = useState<CreateClientForm>({
    name: "",
    email: "",
    expiration_date: "",
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const captureImage = (): void => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  const retakePhoto = (): void => {
    setCapturedImage(null);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!capturedImage) {
      setError("Debes capturar una foto antes de registrar el cliente");
      return;
    }

    if (!formData.name || !formData.email || !formData.expiration_date) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsRegistering(true);
    try {
      setError(null);
      await ApiService.createClientWithFace({
        ...formData,
        image: capturedImage,
      });

      alert("¡Cliente registrado exitosamente con reconocimiento facial!");
      setCurrentView("clients");
    } catch (error) {
      console.error("Error registrando cliente:", error);
      setError(
        error instanceof Error ? error.message : "Error registrando cliente"
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          ➕ Registrar Nuevo Cliente
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📋 Datos del Cliente</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Fecha de vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expiration_date: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">📷 Captura Facial *</h2>

            <div className="text-center">
              {!capturedImage ? (
                <>
                  <div className="mb-4">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="rounded-lg mx-auto max-w-full"
                    />
                  </div>
                  <button
                    onClick={captureImage}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
                  >
                    📸 Capturar Foto
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Posiciona tu rostro frente a la cámara y captura la foto
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <img
                      src={capturedImage}
                      alt="Captured face"
                      className="rounded-lg mx-auto max-w-full border-2 border-green-300"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={retakePhoto}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                    >
                      🔄 Tomar Otra
                    </button>
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={20} className="mr-2" />
                      <span className="font-semibold">Foto Capturada</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={isRegistering || !capturedImage}
            className={`px-8 py-3 rounded-md font-bold text-white transition-colors ${
              isRegistering || !capturedImage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isRegistering ? "Registrando..." : "✅ Registrar Cliente"}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            * Todos los campos y la foto son obligatorios
          </p>
        </div>
      </div>
    </div>
  );
};
