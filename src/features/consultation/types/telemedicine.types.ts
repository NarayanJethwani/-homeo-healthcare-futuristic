/**
 * Domain Types for Phase 3 Live Telemedicine Media Adapter & Call Controls
 */

export type MediaPermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface MediaPermissions {
  camera: MediaPermissionState;
  microphone: MediaPermissionState;
}

export type TelemedicineErrorKind =
  | "permission_denied"
  | "device_not_found"
  | "device_busy_or_unavailable"
  | "unsupported_constraints"
  | "initialization_aborted"
  | "insecure_context_or_policy_block"
  | "unknown";

export interface TelemedicineError {
  kind: TelemedicineErrorKind;
  message: string;
  originalErrorName?: string;
}

export interface TelemedicineDevice {
  deviceId: string;
  groupId?: string;
  kind: MediaDeviceKind;
  label: string;
}

export type LocalMediaStatus = "idle" | "initializing" | "ready" | "partial" | "failed" | "stopped";

export interface LocalMediaState {
  status: LocalMediaStatus;
  cameraEnabled: boolean;
  microphoneEnabled: boolean;
  audioOnly: boolean;
}

export type ProviderConnectionStatus =
  | "unconfigured"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "failed";

export interface ProviderState {
  status: ProviderConnectionStatus;
  providerName?: string;
  roomId?: string;
}

export type TranscriptionStatus =
  | "unavailable"
  | "awaiting_consent"
  | "ready"
  | "listening"
  | "paused"
  | "failed";

export type ConsentStatusValue = "unknown" | "not_required" | "not_granted" | "granted" | "revoked";

export interface TranscriptionConsent {
  status: ConsentStatusValue;
  recordedAt?: string;
  recordedBy?: string;
  policyVersion?: string;
}

export interface TranscriptionState {
  status: TranscriptionStatus;
  consent: TranscriptionConsent;
  providerName?: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: "patient" | "clinician";
  text: string;
  isFinal: boolean;
  timestamp: string;
}

export interface TelemedicineSessionState {
  permissions: MediaPermissions;
  localMedia: LocalMediaState;
  devices: {
    cameras: TelemedicineDevice[];
    microphones: TelemedicineDevice[];
    speakers: TelemedicineDevice[];
    selectedCameraId?: string;
    selectedMicrophoneId?: string;
    selectedSpeakerId?: string;
  };
  provider: ProviderState;
  transcription: TranscriptionState;
  error?: TelemedicineError;
}
