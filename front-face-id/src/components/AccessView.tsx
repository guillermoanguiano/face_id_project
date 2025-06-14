import { Camera, CheckCircle, Clock, XCircle } from "lucide-react";
import React from "react";
import Webcam from "react-webcam";
import type { AccessStatus, FaceRecognitionResult } from "../types";

interface AccessViewProps {
  webcamRef: React.RefObject<Webcam | null>;
  videoConstraints: MediaTrackConstraints;
  accessStatus: AccessStatus;
  recognitionResult: FaceRecognitionResult | null;
  isProcessing: boolean | null;
  error?: string | null;
}

export const AccessView = ({
  webcamRef,
  videoConstraints,
  accessStatus,
  recognitionResult,
  isProcessing = false,
  error = null,
}: AccessViewProps) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-2">💪 GYM ACCESS CONTROL</h1>
      <p className="text-xl opacity-80">Reconocimiento facial automático</p>
    </div>

    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full"
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {accessStatus === "granted" && (
          <div className="bg-green-500/90 rounded-full p-8 animate-pulse">
            <CheckCircle size={64} className="text-white" />
          </div>
        )}
        {accessStatus === "denied" && (
          <div className="bg-red-500/90 rounded-full p-8 animate-pulse">
            <XCircle size={64} className="text-white" />
          </div>
        )}
        {isProcessing && (
          <div className="bg-blue-500/90 rounded-full p-8 animate-spin">
            <Camera size={64} className="text-white" />
          </div>
        )}
      </div>
    </div>

    {recognitionResult && (
      <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm text-center max-w-md">
        <h3 className="text-2xl font-bold mb-2">{recognitionResult.message}</h3>
        {recognitionResult.client && (
          <div className="text-lg">
            <p>Cliente: {recognitionResult.client.name}</p>
            <p>Confianza: {recognitionResult.confidence}%</p>
          </div>
        )}
      </div>
    )}

    {error && (
      <div className="mt-4 p-4 bg-red-500/90 rounded-lg text-white">
        <p>⚠️ {error}</p>
      </div>
    )}

    <div className="mt-6 flex items-center space-x-2 text-sm opacity-60">
      <Clock size={16} />
      <span>Escaneando cada 2 segundos...</span>
    </div>
  </div>
);
