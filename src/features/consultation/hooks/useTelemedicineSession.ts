import { useState, useEffect, useRef, useCallback } from "react";
import {
  TelemedicineSessionState,
  MediaPermissions,
  TelemedicineDevice,
  TelemedicineError,
  TranscriptionConsent,
} from "../types/telemedicine.types";
import {
  checkSecureContext,
  enumerateDevicesSafely,
  normalizeMediaError,
  requestMediaTrack,
  stopStream,
  stopTrack,
} from "../services/telemedicineService";

export interface UseTelemedicineSessionOptions {
  initialConsent?: TranscriptionConsent;
  autoInitialize?: boolean;
}

export function useTelemedicineSession(options: UseTelemedicineSessionOptions = {}) {
  // Store non-serializable MediaStream in a Ref (never in state/store)
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<TelemedicineSessionState>({
    permissions: {
      camera: "idle",
      microphone: "idle",
    },
    localMedia: {
      status: "idle",
      cameraEnabled: false,
      microphoneEnabled: false,
      audioOnly: false,
    },
    devices: {
      cameras: [],
      microphones: [],
      speakers: [],
    },
    provider: {
      status: "unconfigured",
      providerName: "Local Preview Adapter",
    },
    transcription: {
      status: options.initialConsent?.status === "granted" ? "awaiting_consent" : "unavailable",
      consent: options.initialConsent || { status: "unknown" },
    },
  });

  // Attach MediaStream to a video element safely
  const attachVideoRef = useCallback((videoElement: HTMLVideoElement | null) => {
    if (videoElement) {
      if (streamRef.current) {
        videoElement.srcObject = streamRef.current;
      } else {
        videoElement.srcObject = null;
      }
    }
  }, []);

  // Update device list from browser
  const refreshDevices = useCallback(async () => {
    const dev = await enumerateDevicesSafely();
    setState((prev) => ({
      ...prev,
      devices: {
        ...prev.devices,
        cameras: dev.cameras,
        microphones: dev.microphones,
        speakers: dev.speakers,
        selectedCameraId: prev.devices.selectedCameraId || dev.cameras[0]?.deviceId,
        selectedMicrophoneId: prev.devices.selectedMicrophoneId || dev.microphones[0]?.deviceId,
        selectedSpeakerId: prev.devices.selectedSpeakerId || dev.speakers[0]?.deviceId,
      },
    }));
  }, []);

  // Ensure stream container exists
  const getOrCreateStream = useCallback((): MediaStream => {
    if (!streamRef.current) {
      streamRef.current = new MediaStream();
    }
    return streamRef.current;
  }, []);

  // Safe teardown
  const stopSession = useCallback(() => {
    if (streamRef.current) {
      stopStream(streamRef.current);
      streamRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      localMedia: {
        status: "stopped",
        cameraEnabled: false,
        microphoneEnabled: false,
        audioOnly: false,
      },
      error: undefined,
    }));
  }, []);

  // Request camera track independently
  const requestCamera = useCallback(
    async (deviceId?: string) => {
      if (!checkSecureContext()) {
        const err = normalizeMediaError(new DOMException("Insecure context", "SecurityError"));
        setState((prev) => ({ ...prev, error: err }));
        return;
      }

      setState((prev) => ({
        ...prev,
        permissions: { ...prev.permissions, camera: "requesting" },
        localMedia: { ...prev.localMedia, status: "initializing" },
      }));

      try {
        const targetDeviceId = deviceId || state.devices.selectedCameraId;
        const newTrack = await requestMediaTrack("video", targetDeviceId);

        const activeStream = getOrCreateStream();

        // Stop existing video track if any
        const oldTrack = activeStream.getVideoTracks()[0];
        if (oldTrack) {
          activeStream.removeTrack(oldTrack);
          stopTrack(oldTrack);
        }

        activeStream.addTrack(newTrack);

        await refreshDevices();

        setState((prev) => ({
          ...prev,
          permissions: { ...prev.permissions, camera: "granted" },
          localMedia: {
            ...prev.localMedia,
            status: prev.localMedia.microphoneEnabled ? "ready" : "partial",
            cameraEnabled: true,
            audioOnly: false,
          },
          devices: {
            ...prev.devices,
            selectedCameraId: newTrack.getSettings().deviceId || targetDeviceId,
          },
          error: undefined,
        }));
      } catch (err) {
        const normalized = normalizeMediaError(err);
        setState((prev) => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            camera: normalized.kind === "permission_denied" ? "denied" : "unavailable",
          },
          localMedia: {
            ...prev.localMedia,
            status: prev.localMedia.microphoneEnabled ? "partial" : "failed",
            cameraEnabled: false,
          },
          error: normalized,
        }));
      }
    },
    [getOrCreateStream, refreshDevices, state.devices.selectedCameraId]
  );

  // Request microphone track independently
  const requestMicrophone = useCallback(
    async (deviceId?: string) => {
      if (!checkSecureContext()) {
        const err = normalizeMediaError(new DOMException("Insecure context", "SecurityError"));
        setState((prev) => ({ ...prev, error: err }));
        return;
      }

      setState((prev) => ({
        ...prev,
        permissions: { ...prev.permissions, microphone: "requesting" },
        localMedia: { ...prev.localMedia, status: "initializing" },
      }));

      try {
        const targetDeviceId = deviceId || state.devices.selectedMicrophoneId;
        const newTrack = await requestMediaTrack("audio", targetDeviceId);

        const activeStream = getOrCreateStream();

        // Stop existing audio track if any
        const oldTrack = activeStream.getAudioTracks()[0];
        if (oldTrack) {
          activeStream.removeTrack(oldTrack);
          stopTrack(oldTrack);
        }

        activeStream.addTrack(newTrack);

        await refreshDevices();

        setState((prev) => ({
          ...prev,
          permissions: { ...prev.permissions, microphone: "granted" },
          localMedia: {
            ...prev.localMedia,
            status: prev.localMedia.cameraEnabled ? "ready" : "partial",
            microphoneEnabled: true,
          },
          devices: {
            ...prev.devices,
            selectedMicrophoneId: newTrack.getSettings().deviceId || targetDeviceId,
          },
          error: undefined,
        }));
      } catch (err) {
        const normalized = normalizeMediaError(err);
        setState((prev) => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            microphone: normalized.kind === "permission_denied" ? "denied" : "unavailable",
          },
          localMedia: {
            ...prev.localMedia,
            status: prev.localMedia.cameraEnabled ? "partial" : "failed",
            microphoneEnabled: false,
          },
          error: normalized,
        }));
      }
    },
    [getOrCreateStream, refreshDevices, state.devices.selectedMicrophoneId]
  );

  // Request both camera and microphone
  const requestBothMedia = useCallback(async () => {
    await requestCamera();
    await requestMicrophone();
  }, [requestCamera, requestMicrophone]);

  // Toggle Camera (stops track for privacy LED off)
  const toggleCamera = useCallback(async () => {
    if (state.localMedia.cameraEnabled) {
      if (streamRef.current) {
        const videoTrack = streamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          streamRef.current.removeTrack(videoTrack);
          stopTrack(videoTrack);
        }
      }
      setState((prev) => ({
        ...prev,
        localMedia: {
          ...prev.localMedia,
          status: prev.localMedia.microphoneEnabled ? "partial" : "idle",
          cameraEnabled: false,
        },
      }));
    } else {
      await requestCamera();
    }
  }, [requestCamera, state.localMedia.cameraEnabled]);

  // Toggle Microphone (enabled/disabled track state)
  const toggleMicrophone = useCallback(async () => {
    if (state.localMedia.microphoneEnabled) {
      if (streamRef.current) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
        }
      }
      setState((prev) => ({
        ...prev,
        localMedia: { ...prev.localMedia, microphoneEnabled: false },
      }));
    } else {
      if (streamRef.current && streamRef.current.getAudioTracks().length > 0) {
        const audioTrack = streamRef.current.getAudioTracks()[0];
        audioTrack.enabled = true;
        setState((prev) => ({
          ...prev,
          localMedia: { ...prev.localMedia, microphoneEnabled: true },
        }));
      } else {
        await requestMicrophone();
      }
    }
  }, [requestMicrophone, state.localMedia.microphoneEnabled]);

  // Set Audio-Only Mode (stops camera track for LED privacy, preserves camera selection preference)
  const setAudioOnly = useCallback(
    async (enableAudioOnly: boolean) => {
      if (enableAudioOnly) {
        if (streamRef.current) {
          const videoTrack = streamRef.current.getVideoTracks()[0];
          if (videoTrack) {
            streamRef.current.removeTrack(videoTrack);
            stopTrack(videoTrack);
          }
        }
        setState((prev) => ({
          ...prev,
          localMedia: {
            ...prev.localMedia,
            cameraEnabled: false,
            audioOnly: true,
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          localMedia: { ...prev.localMedia, audioOnly: false },
        }));
        await requestCamera();
      }
    },
    [requestCamera]
  );

  // Switch camera device safely
  const switchCameraDevice = useCallback(
    async (deviceId: string) => {
      await requestCamera(deviceId);
    },
    [requestCamera]
  );

  // Switch microphone device safely
  const switchMicrophoneDevice = useCallback(
    async (deviceId: string) => {
      await requestMicrophone(deviceId);
    },
    [requestMicrophone]
  );

  // Hot-plug devicechange listener subscription
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices) return;

    const handleDeviceChange = async () => {
      const updated = await enumerateDevicesSafely();

      // Check if current active camera was unplugged
      if (streamRef.current) {
        const activeVideoTrack = streamRef.current.getVideoTracks()[0];
        if (activeVideoTrack) {
          const stillExists = updated.cameras.some(
            (c) => c.deviceId === activeVideoTrack.getSettings().deviceId
          );
          if (!stillExists) {
            streamRef.current.removeTrack(activeVideoTrack);
            stopTrack(activeVideoTrack);
            setState((prev) => ({
              ...prev,
              localMedia: { ...prev.localMedia, cameraEnabled: false },
              error: {
                kind: "device_not_found",
                message: "Active camera was disconnected.",
              },
            }));
          }
        }

        const activeAudioTrack = streamRef.current.getAudioTracks()[0];
        if (activeAudioTrack) {
          const stillExists = updated.microphones.some(
            (m) => m.deviceId === activeAudioTrack.getSettings().deviceId
          );
          if (!stillExists) {
            streamRef.current.removeTrack(activeAudioTrack);
            stopTrack(activeAudioTrack);
            setState((prev) => ({
              ...prev,
              localMedia: { ...prev.localMedia, microphoneEnabled: false },
              error: {
                kind: "device_not_found",
                message: "Active microphone was disconnected.",
              },
            }));
          }
        }
      }

      await refreshDevices();
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [refreshDevices]);

  // Initial device enumeration on mount
  useEffect(() => {
    refreshDevices();
  }, [refreshDevices]);

  // Teardown media tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopStream(streamRef.current);
        streamRef.current = null;
      }
    };
  }, []);

  return {
    state,
    attachVideoRef,
    requestCamera,
    requestMicrophone,
    requestBothMedia,
    toggleCamera,
    toggleMicrophone,
    setAudioOnly,
    switchCameraDevice,
    switchMicrophoneDevice,
    stopSession,
    refreshDevices,
  };
}
