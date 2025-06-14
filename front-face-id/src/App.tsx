import { Camera, Settings, Users } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { AccessView } from "./components/AccessView";
import { ClientsView } from "./components/ClientsView";
import { RegisterView } from "./components/RegisterView";
import ApiService from "./services/api";
import type {
  AccessStatus,
  AppView,
  Client,
  FaceRecognitionResult,
} from "./types";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>("clients");
  const [accessStatus, setAccessStatus] = useState<AccessStatus>("idle");
  const [recognitionResult, setRecognitionResult] =
    useState<FaceRecognitionResult | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const processingInterval = useRef<NodeJS.Timeout | null>(null);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user" as const,
  };

  const captureAndProcess = useCallback(async (): Promise<void> => {
    if (!webcamRef.current || isProcessing) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await ApiService.verifyAccess({ image: imageSrc });

      setRecognitionResult(result);

      if (result.access_granted) {
        setAccessStatus("granted");
        setTimeout(() => {
          setAccessStatus("idle");
          setRecognitionResult(null);
        }, 9500);
      } else {
        setAccessStatus("denied");
        setTimeout(() => {
          setAccessStatus("idle");
          setRecognitionResult(null);
        }, 8000);
      }
    } catch (error) {
      console.error("Error en reconocimiento:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setAccessStatus("idle");
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (currentView === "access") {
      processingInterval.current = setInterval(captureAndProcess, 2000);
    } else {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    }

    return () => {
      if (processingInterval.current) {
        clearInterval(processingInterval.current);
      }
    };
  }, [currentView, captureAndProcess]);

  const loadClients = async (): Promise<void> => {
    try {
      setError(null);
      const clientsData = await ApiService.getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setError(
        error instanceof Error ? error.message : "Error cargando clientes"
      );
    }
  };

  useEffect(() => {
    if (currentView === "clients") {
      loadClients();
    }
  }, [currentView]);

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView("access")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === "access"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Camera size={20} />
                <span>Control de Acceso</span>
              </button>

              <button
                onClick={() => setCurrentView("clients")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === "clients"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Users size={20} />
                <span>Clientes</span>
              </button>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <Settings size={20} />
              <span>Configuración</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        {currentView === "access" && (
          <AccessView
            webcamRef={webcamRef}
            videoConstraints={videoConstraints}
            accessStatus={accessStatus}
            recognitionResult={recognitionResult}
            isProcessing={isProcessing}
            error={error}
          />
        )}
        {currentView === "clients" && (
          <ClientsView
            clients={clients}
            setCurrentView={setCurrentView}
            error={error}
          />
        )}
        {currentView === "register" && (
          <RegisterView
            setCurrentView={setCurrentView}
            webcamRef={webcamRef}
            videoConstraints={videoConstraints}
            error={error}
            setError={setError}
          />
        )}
      </div>
    </div>
  );
};

export default App;
