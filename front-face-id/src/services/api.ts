import type {
  Client,
  ClientResponse,
  ClientsResponse,
  CreateClientForm,
  CreateClientWithFaceForm,
  FaceRecognitionResult,
  RegisterFaceRequest,
  UpdateClientForm,
  VerifyAccessRequest,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = "Error de conexión con el servidor";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Error de conexión con el servidor");
  }
};

export class ApiService {
  static async getAllClients(): Promise<Client[]> {
    try {
      const response = await apiRequest<ClientsResponse>("/clients");

      console.log(response);
      return response.clients;
    } catch (error) {
      throw new Error(`Error obteniendo clientes: ${error}`);
    }
  }

  static async getClientById(id: number): Promise<Client> {
    try {
      const response = await apiRequest<ClientResponse>(`/clients/${id}`);
      return response.client;
    } catch (error) {
      throw new Error(`Error obteniendo cliente: ${error}`);
    }
  }

  static async createClient(clientData: CreateClientForm): Promise<Client> {
    try {
      const response = await apiRequest<ClientResponse>("/clients", {
        method: "POST",
        body: JSON.stringify(clientData),
      });
      return response.client;
    } catch (error) {
      throw new Error(`Error creando cliente: ${error}`);
    }
  }

  static async createClientWithFace(
    clientData: CreateClientWithFaceForm
  ): Promise<Client> {
    try {
      const response = await apiRequest<ClientResponse>("/clients/with-face", {
        method: "POST",
        body: JSON.stringify(clientData),
      });
      return response.client;
    } catch (error) {
      throw new Error(`Error creando cliente: ${error}`);
    }
  }

  static async updateClient(
    id: number,
    clientData: UpdateClientForm
  ): Promise<Client> {
    try {
      const response = await apiRequest<ClientResponse>(`/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(clientData),
      });
      return response.client;
    } catch (error) {
      throw new Error(`Error actualizando cliente: ${error}`);
    }
  }

  static async registerFace(data: RegisterFaceRequest): Promise<Client> {
    try {
      const response = await apiRequest<ClientResponse>("/register-face", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.client;
    } catch (error) {
      throw new Error(`Error registrando rostro: ${error}`);
    }
  }

  static async verifyAccess(
    data: VerifyAccessRequest
  ): Promise<FaceRecognitionResult> {
    try {
      const response = await apiRequest<FaceRecognitionResult>(
        "/verify-access",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      return response;
    } catch (error) {
      throw new Error(`Error verificando acceso: ${error}`);
    }
  }

  static async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default ApiService;
