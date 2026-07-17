import React from 'react';
import { render, fireEvent, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RepertoryWorkbench } from '../src/features/repertory/components/RepertoryWorkbench';
import * as projectionModule from '../src/features/repertory/projections/RubricMiasmProjectionV1';

// Mocks for database writes
const mockAddDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();

// Mock Firestore/Firebase completely to avoid db calls during tests
vi.mock('@/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  onSnapshot: vi.fn(() => vi.fn()),
  query: vi.fn(),
  orderBy: vi.fn(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  setDoc: (...args: any[]) => mockSetDoc(...args),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: any[]) => mockDeleteDoc(...args)
}));

// Mock catalog data
const mockRubrics = [
  {
    rubricId: 'jeth_rb_eczema_itching_scratching',
    title: 'Skin; eczema; itching',
    classicalWording: 'Eczema with intense itching',
    category: 'Skin',
    organSystem: 'Skin / Integumentary',
    remedyGrades: []
  },
  {
    rubricId: 'jeth_rb_pain_burning_arsenicum',
    title: 'Generalities; pain; burning',
    classicalWording: 'Burning pains',
    category: 'Pain',
    organSystem: 'Generalities',
    remedyGrades: []
  },
  {
    rubricId: 'jeth_rb_asthma_night_midnight',
    title: 'Chest; asthma; night; midnight',
    classicalWording: 'Asthma at midnight',
    category: 'Respiratory',
    organSystem: 'Respiratory',
    remedyGrades: []
  },
  {
    rubricId: 'unmapped_rubric',
    title: 'Unmapped Rubric',
    classicalWording: 'Unmapped symptom',
    category: 'Skin',
    organSystem: 'Skin / Integumentary',
    remedyGrades: []
  }
];

const mockSearchFullRubrics = vi.fn().mockResolvedValue(mockRubrics);
const mockGetRubrics = vi.fn().mockResolvedValue(mockRubrics);
const mockLoadInitialRubrics = vi.fn().mockResolvedValue(mockRubrics);
const mockRunClinicalAnalysis = vi.fn().mockResolvedValue({
  success: true,
  scoringResult: {
    remedyScores: [{ remedyId: 'Nux-v', score: 10, matchedRubricsCount: 1 }],
    maxPossibleScore: 10,
    rubricCoverage: { 'Nux-v': 1 },
    topRemedies: [{ remedyId: 'Nux-v', score: 10, matchedRubricsCount: 1 }],
    confidenceScore: 95,
    missingDataNeeded: []
  },
  differentiations: [],
  reasoningSummary: {
    summary: 'Mock clinical reasoning',
    remedyReasoning: {},
    topRemedies: [{ remedyId: 'Nux-v', remedyName: 'Nux Vomica', confidence: 95 }]
  },
  validationFindings: []
});
const mockGetLongitudinalSummary = vi.fn().mockResolvedValue({
  timeline: [],
  recentRemedyMatched: 'Nux-v',
  remedyResponseTrend: 'stable'
});

vi.mock('../src/features/repertory/clinicalWorkspace/clinicalRepertoryService', () => {
  return {
    createClinicalRepertoryService: () => ({
      searchFullRubrics: mockSearchFullRubrics,
      getRubrics: mockGetRubrics,
      loadInitialRubrics: mockLoadInitialRubrics,
      runClinicalAnalysis: mockRunClinicalAnalysis,
      getLongitudinalSummary: mockGetLongitudinalSummary
    })
  };
});

describe('Sprint 28D Miasmatic Filtering & Projection Read Model Tests', () => {
  let getMiasmsSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    // Mock the approved miasms for UI rendering tests by default
    getMiasmsSpy = vi.spyOn(projectionModule, 'getApprovedMiasmsForRubric').mockImplementation((rubricId) => {
      if (rubricId === 'jeth_rb_eczema_itching_scratching') return ['psora'];
      if (rubricId === 'jeth_rb_pain_burning_arsenicum') return ['psora'];
      if (rubricId === 'jeth_rb_asthma_night_midnight') return ['tubercular'];
      if (rubricId === 'abdomen-flatulence') return ['psora', 'sycosis'];
      return ['unclassified'];
    });
  });

  afterEach(() => {
    if (getMiasmsSpy) {
      getMiasmsSpy.mockRestore();
    }
  });

  // Test 1: Production Corpus Immutability and Empty Check
  it('should assert the production corpus is completely empty and deeply frozen', () => {
    const rawDict = projectionModule.getRawProjectionForValidation();
    expect(rawDict).toEqual({});
    expect(Object.keys(rawDict).length).toBe(0);
    expect(Object.isFrozen(rawDict)).toBe(true);
  });

  // Test 2: Injected Seam Security (Override is impossible in production environment)
  it('should verify filter controls are hidden in production environment even if enabling prop is true', async () => {
    const originalNodeEnv = process.env.NODE_ENV;

    // Simulate production environment
    process.env.NODE_ENV = 'production';

    await act(async () => {
      render(
        <RepertoryWorkbench
          sessionUid="session-123"
          activePatientId="patient-456"
          enableMiasmaticFilter={true}
        />
      );
    });

    // Filter controls should not be rendered
    const psoraButton = screen.queryByRole('button', { name: /psora/i });
    expect(psoraButton).toBeNull();

    // Restore environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  // Test 3: Isolated Schema Validator Checks
  it('should strictly validate mappings using isolated test fixtures', () => {
    // Valid mapping record
    const validRecord: projectionModule.RubricMiasmClassificationV1 = {
      rubricId: 'test_rubric_1',
      miasms: ['psora'],
      provenance: "Kent's Lectures",
      projectionVersion: '1.0.0',
      reviewStatus: 'approved',
      reviewRecordId: 'rev_28d_001',
      sourceMetadata: {
        referenceBook: 'Kent Lectures',
        pageNumber: 120
      }
    };
    expect(projectionModule.validateMapping('test_rubric_1', validRecord).isValid).toBe(true);

    // Mismatched key-to-rubricId must fail validation
    expect(projectionModule.validateMapping('mismatched_key', validRecord).isValid).toBe(false);

    // Duplicate miasm tokens must fail validation
    const duplicateRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      miasms: ['psora', 'psora']
    };
    const duplicateVal = projectionModule.validateMapping('test_rubric_1', duplicateRecord);
    expect(duplicateVal.isValid).toBe(false);
    expect(duplicateVal.errors).toContain('Duplicate miasm token: psora');

    // Unclassified combined with other miasms must fail validation
    const mixedRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      miasms: ['unclassified', 'psora']
    };
    const mixedVal = projectionModule.validateMapping('test_rubric_1', mixedRecord);
    expect(mixedVal.isValid).toBe(false);
    expect(mixedVal.errors).toContain('unclassified cannot be combined with other miasms');

    // Invalid projection version must fail
    const invalidVerRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      projectionVersion: '2.0.0' as any
    };
    const invalidVerVal = projectionModule.validateMapping('test_rubric_1', invalidVerRecord);
    expect(invalidVerVal.isValid).toBe(false);
    expect(invalidVerVal.errors).toContain("projectionVersion must be exactly '1.0.0'");

    // Invalid review status must fail
    const draftRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      reviewStatus: 'draft'
    };
    const draftVal = projectionModule.validateMapping('test_rubric_1', draftRecord);
    expect(draftVal.isValid).toBe(false);
    expect(draftVal.errors).toContain("reviewStatus must be exactly 'approved' in active mappings");

    // Invalid reviewRecordId format must fail
    const invalidIdRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      reviewRecordId: 'rev-jethwani-28d'
    };
    const invalidIdVal = projectionModule.validateMapping('test_rubric_1', invalidIdRecord);
    expect(invalidIdVal.isValid).toBe(false);
    expect(invalidIdVal.errors).toContain('reviewRecordId must match opaque format rev_[a-zA-Z0-9_]+');

    // Non-positive page number must fail
    const negativePageRecord: projectionModule.RubricMiasmClassificationV1 = {
      ...validRecord,
      sourceMetadata: {
        referenceBook: 'Kent Lectures',
        pageNumber: -5
      }
    };
    const negativePageVal = projectionModule.validateMapping('test_rubric_1', negativePageRecord);
    expect(negativePageVal.isValid).toBe(false);
    expect(negativePageVal.errors).toContain('sourceMetadata.pageNumber must be a positive integer');
  });

  // Test 4: Miasmatic Filter Toggling Invariance (Delta assertions and zero-write assertions across boundaries)
  it('should perform filtering in-memory with zero side-effects to writes, router, local storage, fetches, and delta service counts', async () => {
    // Zero-write boundary spies
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    const sessionStorageSpy = vi.spyOn(Storage.prototype, 'setItem');
    const fetchSpy = vi.spyOn(window, 'fetch');
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    const replaceStateSpy = vi.spyOn(window.history, 'replaceState');
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <RepertoryWorkbench
        sessionUid="session-123"
        activePatientId="patient-456"
        enableMiasmaticFilter={true}
      />
    );

    // Wait for rubrics to load
    await screen.findByText('Skin; eczema; itching');

    // Capture initial call counts of initialization methods
    const initialGetRubrics = mockGetRubrics.mock.calls.length;
    const initialLoadInitial = mockLoadInitialRubrics.mock.calls.length;
    const initialSearchFull = mockSearchFullRubrics.mock.calls.length;
    const initialRunAnalysis = mockRunClinicalAnalysis.mock.calls.length;
    const initialGetTimeline = mockGetLongitudinalSummary.mock.calls.length;

    // Reset spied call counts from mounting for write-only boundaries
    mockAddDoc.mockClear();
    mockSetDoc.mockClear();
    mockUpdateDoc.mockClear();
    mockDeleteDoc.mockClear();
    storageSpy.mockClear();
    sessionStorageSpy.mockClear();
    fetchSpy.mockClear();
    pushStateSpy.mockClear();
    replaceStateSpy.mockClear();

    // Toggle the "psora" filter button
    const psoraButton = screen.getByRole('button', { name: /psora/i });
    await act(async () => {
      fireEvent.click(psoraButton);
    });

    // Assert absolute zero-writes on state/database/fetch boundaries
    expect(mockAddDoc).not.toHaveBeenCalled();
    expect(mockSetDoc).not.toHaveBeenCalled();
    expect(mockUpdateDoc).not.toHaveBeenCalled();
    expect(mockDeleteDoc).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
    expect(sessionStorageSpy).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(replaceStateSpy).not.toHaveBeenCalled();
    expect(consoleWarnSpy).not.toHaveBeenCalled();

    // Assert zero delta (unchanged call counts) on read/calculation services
    expect(mockGetRubrics.mock.calls.length).toBe(initialGetRubrics);
    expect(mockLoadInitialRubrics.mock.calls.length).toBe(initialLoadInitial);
    expect(mockSearchFullRubrics.mock.calls.length).toBe(initialSearchFull);
    expect(mockRunClinicalAnalysis.mock.calls.length).toBe(initialRunAnalysis);
    expect(mockGetLongitudinalSummary.mock.calls.length).toBe(initialGetTimeline);

    consoleWarnSpy.mockRestore();
  });

  // Test 5: Reset on Workspace/Patient Lifecycle Change (Exchanged independently)
  it('should reset filter selection when patient or session UID changes independently', async () => {
    const { rerender } = render(
      <RepertoryWorkbench
        sessionUid="session-123"
        activePatientId="patient-456"
        enableMiasmaticFilter={true}
      />
    );

    const psoraButton = screen.getByRole('button', { name: /psora/i });

    // 1. Reselect filter, trigger Patient Change reset
    await act(async () => {
      fireEvent.click(psoraButton);
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'true');

    await act(async () => {
      rerender(
        <RepertoryWorkbench
          sessionUid="session-123"
          activePatientId="patient-789"
          enableMiasmaticFilter={true}
        />
      );
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'false');

    // 2. Reselect filter, trigger Session UID Change reset
    await act(async () => {
      fireEvent.click(psoraButton);
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'true');

    await act(async () => {
      rerender(
        <RepertoryWorkbench
          sessionUid="session-999"
          activePatientId="patient-789"
          enableMiasmaticFilter={true}
        />
      );
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'false');
  });

  // Test 6: Invariance of Selected Rubrics & Calculation Results with Initial Settlement
  it('should prove that toggling filters leaves active case selections and computed scores completely identical', async () => {
    render(
      <RepertoryWorkbench
        sessionUid="session-123"
        activePatientId="patient-456"
        enableMiasmaticFilter={true}
      />
    );

    // Wait for rubrics to load
    await screen.findByText('Skin; eczema; itching');

    // Add a rubric to workbench to trigger clinical analysis
    const eczemaToggles = await screen.findAllByTitle('Add to workbench');
    const eczemaToggle = eczemaToggles[0];
    await act(async () => {
      fireEvent.click(eczemaToggle);
    });

    // Wait for initial analysis calculation to settle and display the mock score
    await waitFor(() => {
      expect(screen.getAllByText('Nux-v').length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Score: 10/).length).toBeGreaterThan(0);
    });

    // Snapshot the analysis invocation count and remedy score ranking text
    const analysisCountBefore = mockRunClinicalAnalysis.mock.calls.length;
    const remedyScoreTextBefore = screen.getAllByText('Nux-v')[0].textContent;
    const scoreValTextBefore = screen.getAllByText(/Score: 10/)[0].textContent;

    // Toggle the "psora" filter button
    const psoraButton = screen.getByRole('button', { name: /psora/i });
    await act(async () => {
      fireEvent.click(psoraButton);
    });

    // Assert that the analysis invocation count is identical (no additional analysis was run)
    expect(mockRunClinicalAnalysis.mock.calls.length).toBe(analysisCountBefore);

    // Assert displayed scoring and ranking values remain identical
    expect(screen.getAllByText('Nux-v')[0].textContent).toBe(remedyScoreTextBefore);
    expect(screen.getAllByText(/Score: 10/)[0].textContent).toBe(scoreValTextBefore);
  });

  // Test 7: Accessibility: Keyboard focus navigation, button triggers, and reduced-motion assertions
  it('should support full keyboard focus, arrow key navigation, Space/Enter activation, and motion safety controls', async () => {
    render(
      <RepertoryWorkbench
        sessionUid="session-123"
        activePatientId="patient-456"
        enableMiasmaticFilter={true}
      />
    );

    const psoraButton = await screen.findByRole('button', { name: /psora/i });
    const sycosisButton = screen.getByRole('button', { name: /sycosis/i });

    // Assert that both the miasm buttons and the clear button contain the reduced-motion css class
    expect(psoraButton).toHaveClass('motion-reduce:transition-none');
    expect(sycosisButton).toHaveClass('motion-reduce:transition-none');

    // Focus the first button
    act(() => {
      psoraButton.focus();
    });
    expect(document.activeElement).toBe(psoraButton);

    // Navigate using arrow right
    await act(async () => {
      fireEvent.keyDown(psoraButton, { key: 'ArrowRight' });
    });
    expect(document.activeElement).toBe(sycosisButton);

    // Focus back to psora
    act(() => {
      psoraButton.focus();
    });

    // Activate using keydown Enter
    await act(async () => {
      fireEvent.keyDown(psoraButton, { key: 'Enter' });
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'true');

    // Deactivate using keydown Space
    await act(async () => {
      fireEvent.keyDown(psoraButton, { key: ' ' });
    });
    expect(psoraButton).toHaveAttribute('aria-pressed', 'false');

    // Select psora and assert clear button class list contains reduced motion
    await act(async () => {
      fireEvent.keyDown(psoraButton, { key: ' ' });
    });
    const clearButton = screen.getByRole('button', { name: /clear filter/i });
    expect(clearButton).toHaveClass('motion-reduce:transition-none');
  });
});
