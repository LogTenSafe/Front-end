import { Result } from 'ts-results'
import { Backup } from '@/types'

/**
 * The shape of validation errors received from the backend. A dictionary mapping field names to a
 * list of their errors.
 */
export type Errors = Record<string, string[]>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {
  // no root properties
}

export interface BackupsState {
  backups: Backup[] | null;
  backupsLoading: boolean;
  backupsError: string | null;
  backupsPage: number
  backupsCount: number
}

export interface SessionState {
  JWT: string | null;
}

export type AnyModuleState = BackupsState | SessionState

export interface APISuccess<T> {
  response: Response;
  body?: T;
}

export interface APIFailure {
  response: Response;
  body: {errors: Errors}
}

export type APIResponse<T> = Result<APISuccess<T>, APIFailure>
