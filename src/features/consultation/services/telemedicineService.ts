/**
 * Client-Safe Telemedicine Media & Device Lifecycle Service
 */

import {
  TelemedicineDevice,
  TelemedicineError,
  TelemedicineErrorKind,
} from "../types/telemedicine.types";

export function checkSecureContext(): boolean {
  if (typeof window === "undefined") return true;
  return Boolean(window.isSecureContext);
}

export function normalizeMediaError(err: unknown): TelemedicineError {
  if (!checkSecureContext()) {
    return {
      kind: "insecure_context_or_policy_block",
      message: "Media access is blocked because the application is not running in a secure context (HTTPS or localhost).",
    };
  }

  if (err && typeof err === "object" && "name" in err) {
    const errorName = String((err as { name?: string }).name);
    let kind: TelemedicineErrorKind = "unknown";
    let message = "An unknown media initialization error occurred.";

    switch (errorName) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        kind = "permission_denied";
        message = "Camera or microphone permission was denied by the user or system.";
        break;
      case "NotFoundError":
      case "DevicesNotFoundError":
        kind = "device_not_found";
        message = "No matching camera or microphone device was detected.";
        break;
      case "NotReadableError":
      case "TrackStartError":
        kind = "device_busy_or_unavailable";
        message = "The selected device is already in use by another application or operating system process.";
        break;
      case "OverconstrainedError":
      case "ConstraintNotSatisfiedError":
        kind = "unsupported_constraints";
        message = "The requested video resolution or audio constraints are not supported by the device.";
        break;
      case "AbortError":
        kind = "initialization_aborted";
        message = "Media device initialization was aborted.";
        break;
      case "SecurityError":
        kind = "insecure_context_or_policy_block";
        message = "Media access was blocked by browser security policy.";
        break;
      default:
        kind = "unknown";
        message = err instanceof Error ? err.message : "Media device access failed.";
        break;
    }

    return {
      kind,
      message,
      originalErrorName: errorName,
    };
  }

  return {
    kind: "unknown",
    message: err instanceof Error ? err.message : "Failed to access media devices.",
  };
}

export async function enumerateDevicesSafely(): Promise<{
  cameras: TelemedicineDevice[];
  microphones: TelemedicineDevice[];
  speakers: TelemedicineDevice[];
}> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
    return { cameras: [], microphones: [], speakers: [] };
  }

  try {
    const nativeDevices = await navigator.mediaDevices.enumerateDevices();
    let cameraCount = 0;
    let micCount = 0;
    let speakerCount = 0;

    const cameras: TelemedicineDevice[] = [];
    const microphones: TelemedicineDevice[] = [];
    const speakers: TelemedicineDevice[] = [];

    for (const d of nativeDevices) {
      if (d.kind === "videoinput") {
        cameraCount++;
        cameras.push({
          deviceId: d.deviceId || `cam_${cameraCount}`,
          groupId: d.groupId,
          kind: "videoinput",
          label: d.label || `Camera ${cameraCount}`,
        });
      } else if (d.kind === "audioinput") {
        micCount++;
        microphones.push({
          deviceId: d.deviceId || `mic_${micCount}`,
          groupId: d.groupId,
          kind: "audioinput",
          label: d.label || `Microphone ${micCount}`,
        });
      } else if (d.kind === "audiooutput") {
        speakerCount++;
        speakers.push({
          deviceId: d.deviceId || `spk_${speakerCount}`,
          groupId: d.groupId,
          kind: "audiooutput",
          label: d.label || `Speaker ${speakerCount}`,
        });
      }
    }

    return { cameras, microphones, speakers };
  } catch {
    return { cameras: [], microphones: [], speakers: [] };
  }
}

export async function requestMediaTrack(
  kind: "video" | "audio",
  deviceId?: string
): Promise<MediaStreamTrack> {
  if (!checkSecureContext()) {
    throw new DOMException("Insecure context", "SecurityError");
  }

  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new DOMException("MediaDevices API unavailable", "NotFoundError");
  }

  const constraints: MediaStreamConstraints =
    kind === "video"
      ? {
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
          audio: false,
        }
      : {
          audio: deviceId ? { deviceId: { exact: deviceId } } : true,
          video: false,
        };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const track = kind === "video" ? stream.getVideoTracks()[0] : stream.getAudioTracks()[0];

  if (!track) {
    throw new DOMException(`No ${kind} track found in acquired stream`, "NotFoundError");
  }

  return track;
}

export function stopTrack(track: MediaStreamTrack | null | undefined): void {
  if (track) {
    try {
      track.enabled = false;
      track.stop();
    } catch {
      // Ignored during teardown
    }
  }
}

export function stopStream(stream: MediaStream | null | undefined): void {
  if (stream) {
    try {
      stream.getTracks().forEach((track) => stopTrack(track));
    } catch {
      // Ignored during teardown
    }
  }
}
