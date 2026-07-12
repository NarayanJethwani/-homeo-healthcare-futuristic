import { useState, useEffect, useCallback } from "react";
import {
  RepertorySource,
  RepertoryEdition,
  RepertoryChapter,
  RepertoryRubricRecord,
  RepertorySourceId,
  RepertoryEditionId,
  RepertoryChapterId,
  RubricRecordId
} from "../types/repertoryTypes";
import { RubricSearchResult } from "../search/RubricSearchIndex";

export type RetrievalUiState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: {
      sources: RepertorySource[];
      editions: RepertoryEdition[];
      chapters: RepertoryChapter[];
      rubrics: RepertoryRubricRecord[];
      searchResults: RubricSearchResult[];
      hasNextPage: boolean;
      nextCursor?: string;
    } }
  | { status: "empty" }
  | { status: "unavailable"; reason: string }
  | { status: "error"; message: string };

export function useRepertoryRetrieval() {
  const [state, setState] = useState<RetrievalUiState>({ status: "idle" });
  const [sources, setSources] = useState<RepertorySource[]>([]);
  const [editions, setEditions] = useState<RepertoryEdition[]>([]);
  const [chapters, setChapters] = useState<RepertoryChapter[]>([]);
  const [rubrics, setRubrics] = useState<RepertoryRubricRecord[]>([]);
  const [searchResults, setSearchResults] = useState<RubricSearchResult[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<RepertorySourceId | null>(null);
  const [selectedEditionId, setSelectedEditionId] = useState<RepertoryEditionId | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<RepertoryChapterId | null>(null);
  const [query, setQuery] = useState("");
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Fetch sources
  const fetchSources = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/v1/repertory/knowledge/sources");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to fetch sources");
      }
      setSources(json.data || []);
      if (json.data && json.data.length > 0) {
        setState({
          status: "loaded",
          data: {
            sources: json.data,
            editions: [],
            chapters: [],
            rubrics: [],
            searchResults: [],
            hasNextPage: false
          }
        });
      } else {
        setState({ status: "empty" });
      }
    } catch (e: any) {
      setState({ status: "error", message: e.message || "Failed to load sources" });
    }
  }, []);

  // Fetch editions for selected source
  const selectSource = useCallback(async (sourceId: RepertorySourceId) => {
    setSelectedSourceId(sourceId);
    setSelectedEditionId(null);
    setSelectedChapterId(null);
    setChapters([]);
    setRubrics([]);
    setSearchResults([]);
    setState({ status: "loading" });

    try {
      const res = await fetch(`/api/v1/repertory/knowledge/sources/${sourceId}/editions`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to load editions");
      }
      setEditions(json.data || []);
      setState({
        status: "loaded",
        data: {
          sources,
          editions: json.data || [],
          chapters: [],
          rubrics: [],
          searchResults: [],
          hasNextPage: false
        }
      });
    } catch (e: any) {
      setState({ status: "error", message: e.message || "Failed to load editions" });
    }
  }, [sources]);

  // Fetch chapters for selected edition
  const selectEdition = useCallback(async (editionId: RepertoryEditionId) => {
    setSelectedEditionId(editionId);
    setSelectedChapterId(null);
    setRubrics([]);
    setSearchResults([]);
    setState({ status: "loading" });

    try {
      const res = await fetch(`/api/v1/repertory/knowledge/editions/${editionId}/chapters`);
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          setState({ status: "unavailable", reason: "This source is unavailable for the current account." });
          return;
        }
        throw new Error(json.error?.message || "Failed to load chapters");
      }
      setChapters(json.data || []);
      setState({
        status: "loaded",
        data: {
          sources,
          editions,
          chapters: json.data || [],
          rubrics: [],
          searchResults: [],
          hasNextPage: false
        }
      });
    } catch (e: any) {
      setState({ status: "error", message: e.message || "Failed to load chapters" });
    }
  }, [sources, editions]);

  // Fetch rubrics in active chapter
  const selectChapter = useCallback(async (chapterId: RepertoryChapterId, cursor?: string) => {
    if (!selectedEditionId) return;
    setSelectedChapterId(chapterId);
    setSearchResults([]);
    setState({ status: "loading" });

    try {
      const url = `/api/v1/repertory/knowledge/rubrics?editionId=${selectedEditionId}&chapterId=${encodeURIComponent(chapterId)}` + 
                  (cursor ? `&cursor=${cursor}` : "");
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to load rubrics");
      }

      const list = json.data || [];
      const updatedRubrics = cursor ? [...rubrics, ...list] : list;
      setRubrics(updatedRubrics);
      setHasNextPage(!!json.metadata?.pagination?.hasNextPage);
      setNextCursor(json.metadata?.pagination?.nextCursor);

      setState({
        status: updatedRubrics.length > 0 ? "loaded" : "empty",
        data: {
          sources,
          editions,
          chapters,
          rubrics: updatedRubrics,
          searchResults: [],
          hasNextPage: !!json.metadata?.pagination?.hasNextPage,
          nextCursor: json.metadata?.pagination?.nextCursor
        }
      });
    } catch (e: any) {
      setState({ status: "error", message: e.message || "Failed to load rubrics" });
    }
  }, [selectedEditionId, rubrics, sources, editions, chapters]);

  // Execute text-only relevance search
  const executeSearch = useCallback(async (q: string, cursor?: string) => {
    setQuery(q);
    setSelectedChapterId(null);
    setRubrics([]);
    setState({ status: "loading" });

    try {
      let url = `/api/v1/repertory/knowledge/search?q=${encodeURIComponent(q)}`;
      if (selectedEditionId) {
        url += `&editionIds=${selectedEditionId}`;
      }
      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to execute search");
      }

      const list = json.data || [];
      const updatedResults = cursor ? [...searchResults, ...list] : list;
      setSearchResults(updatedResults);
      setHasNextPage(!!json.metadata?.pagination?.hasNextPage);
      setNextCursor(json.metadata?.pagination?.nextCursor);

      setState({
        status: updatedResults.length > 0 ? "loaded" : "empty",
        data: {
          sources,
          editions,
          chapters,
          rubrics: [],
          searchResults: updatedResults,
          hasNextPage: !!json.metadata?.pagination?.hasNextPage,
          nextCursor: json.metadata?.pagination?.nextCursor
        }
      });
    } catch (e: any) {
      setState({ status: "error", message: e.message || "Failed to run search" });
    }
  }, [selectedEditionId, searchResults, sources, editions, chapters]);

  // Load next page helper
  const loadNextPage = useCallback(() => {
    if (!hasNextPage || !nextCursor) return;
    if (selectedChapterId) {
      selectChapter(selectedChapterId, nextCursor);
    } else if (query) {
      executeSearch(query, nextCursor);
    }
  }, [hasNextPage, nextCursor, selectedChapterId, query, selectChapter, executeSearch]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return {
    state,
    sources,
    editions,
    chapters,
    rubrics,
    searchResults,
    selectedSourceId,
    selectedEditionId,
    selectedChapterId,
    query,
    hasNextPage,
    fetchSources,
    selectSource,
    selectEdition,
    selectChapter,
    executeSearch,
    loadNextPage
  };
}
