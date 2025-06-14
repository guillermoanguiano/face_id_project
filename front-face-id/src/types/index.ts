// Existing types
export type AppView = "access" | "clients" | "register";
export type AccessStatus = "idle" | "granted" | "denied";

export interface Client {
  id: number;
  name: string;
  email: string;
  expiration_date: string;
  has_face: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientForm {
  name: string;
  email: string;
  expiration_date: string;
}

export interface CreateClientWithFaceForm extends CreateClientForm {
  image: string;
}

export interface UpdateClientForm {
  name?: string;
  email?: string;
  expiration_date?: string;
  active?: boolean;
}

export interface RegisterFaceRequest {
  client_id: number;
  image: string;
}

export interface VerifyAccessRequest {
  image: string;
}

export interface FaceRecognitionResult {
  success: boolean;
  access_granted: boolean;
  message: string;
  client: Client | null;
  confidence?: number;
}

export interface ClientResponse {
  success: boolean;
  client: Client;
  message?: string;
}

export interface ClientsResponse {
  success: boolean;
  clients: Client[];
  message?: string;
}
