import { CursorCodec as ServerCursorCodec } from "../../../server/repertory/cursor/cursor.types";

export type CursorCodec = ServerCursorCodec;

export interface PaginatedResult<T> {
  items: T[];
  hasNextPage: boolean;
  nextCursor?: string;
  totalCount?: number;
  sourceVersion: string;
}
