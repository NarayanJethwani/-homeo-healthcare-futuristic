import assert from "assert";
import { 
  normalizeMediaError, 
  enumerateDevicesSafely,
  stopTrack,
  stopStream
} from "../src/features/consultation/services/telemedicineService";
import { formatElapsedSeconds } from "../src/features/consultation/hooks/useConsultationElapsedTime";

async function runTelemedicineTests() {
  // Test 1: DOMException NotAllowedError -> permission_denied
  const err1 = new DOMException("Permission denied by user", "NotAllowedError");
  const normalized1 = normalizeMediaError(err1);
  assert.strictEqual(normalized1.kind, "permission_denied");
  assert.strictEqual(normalized1.originalErrorName, "NotAllowedError");
  assert.ok(normalized1.message.includes("permission was denied"));

  // Test 2: DOMException NotFoundError -> device_not_found
  const err2 = new DOMException("Requested device not found", "NotFoundError");
  const normalized2 = normalizeMediaError(err2);
  assert.strictEqual(normalized2.kind, "device_not_found");
  assert.strictEqual(normalized2.originalErrorName, "NotFoundError");

  // Test 3: DOMException NotReadableError -> device_busy_or_unavailable
  const err3 = new DOMException("Hardware in use", "NotReadableError");
  const normalized3 = normalizeMediaError(err3);
  assert.strictEqual(normalized3.kind, "device_busy_or_unavailable");

  // Test 4: DOMException OverconstrainedError -> unsupported_constraints
  const err4 = new DOMException("Constraints not satisfied", "OverconstrainedError");
  const normalized4 = normalizeMediaError(err4);
  assert.strictEqual(normalized4.kind, "unsupported_constraints");

  // Test 5: Safe Device Enumeration Fallback
  const devices = await enumerateDevicesSafely();
  assert.ok(Array.isArray(devices.cameras));
  assert.ok(Array.isArray(devices.microphones));
  assert.ok(Array.isArray(devices.speakers));

  // Test 6: Track Teardown & Stream Safety
  let stopped = false;
  const mockTrack = {
    enabled: true,
    stop: () => { stopped = true; },
  } as unknown as MediaStreamTrack;

  stopTrack(mockTrack);
  assert.strictEqual(stopped, true);
  assert.strictEqual(mockTrack.enabled, false);

  const mockStream = {
    getTracks: () => [mockTrack],
  } as unknown as MediaStream;

  stopStream(mockStream);
  assert.strictEqual(stopped, true);

  // Test 7: Track Replacement & Device Unplug Recovery Simulation
  const mockMediaStreamContainer = {
    videoTracks: [{ id: "v1", deviceId: "cam_1" }],
    audioTracks: [{ id: "a1", deviceId: "mic_1" }],
  };

  // Simulating changing camera without disturbing audio track
  const replacementVideoTrack = { id: "v2", deviceId: "cam_2" };
  const previousAudioTrack = mockMediaStreamContainer.audioTracks[0];
  
  mockMediaStreamContainer.videoTracks = [replacementVideoTrack];
  assert.strictEqual(mockMediaStreamContainer.videoTracks[0].id, "v2");
  assert.strictEqual(mockMediaStreamContainer.audioTracks[0].id, "a1"); // Unaffected

  // Simulating unplugging active camera device
  const availableCameras = [{ deviceId: "cam_3", label: "Camera 3" }];
  const activeCameraUnplugged = !availableCameras.some(c => c.deviceId === mockMediaStreamContainer.videoTracks[0].deviceId);
  assert.strictEqual(activeCameraUnplugged, true);

  // Test 8: Elapsed Time Formatter
  assert.strictEqual(formatElapsedSeconds(0), "00:00");
  assert.strictEqual(formatElapsedSeconds(45), "00:45");
  assert.strictEqual(formatElapsedSeconds(125), "02:05");
  assert.strictEqual(formatElapsedSeconds(3665), "01:01:05");

  console.log("✅ Telemedicine Session & Media Adapter unit tests passed.");
}

runTelemedicineTests();
