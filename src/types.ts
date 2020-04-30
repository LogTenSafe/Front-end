/* eslint-disable camelcase */

import { DateTime } from 'luxon'

interface Flight {
  date: DateTime;
  origin: string | null;
  destination: string | null;
  duration: number;
}

interface Logbook {
  size: number;
}

/** Represents a backup received from the server. */

export interface Backup {

  /** The database ID. */
  id: number;

  /** When the backup was created. */
  createdAt: DateTime;

  /** The hostname of the computer that uploaded the backup. */
  hostname: string | null;

  /** The last flight in the logbook for this backup. */
  lastFlight: Flight | null;

  /** The total number of hours across all flights in this logbook. */
  totalHours: number | null;

  /** Information about the logbook file for this backup. */
  logbook: Logbook;

  /** A URL where the logbook can be downloaded. */
  downloadURL: string;
}

/** Represents the shape of the JSON data for a backup received by the server. */

export interface BackupJSON {
  id: number;
  created_at: string;
  hostname: string | null;
  last_flight: {
    date: string;
    origin: string | null;
    destination: string | null;
    duration: number;
  };
  total_hours: number;
  logbook: {size: number};
  download_url: string;
  destroyed: boolean;
}

/**
 * Converts a {@link BackupJSON} object received from the server JSON API to a {@link Backup} used
 * by this application.
 *
 * @param json The parse JSON object.
 * @return The Backup.
 */

export function backupFromJSON(json: BackupJSON): Backup {
  return {
    id: json.id,
    createdAt: DateTime.fromISO(json.created_at),
    hostname: json.hostname,
    lastFlight: json.last_flight ? {
      date: DateTime.fromISO(json.last_flight.date),
      origin: json.last_flight.origin,
      destination: json.last_flight.destination,
      duration: json.last_flight.duration
    } : null,
    totalHours: json.total_hours,
    logbook: {
      size: json.logbook.size
    },
    downloadURL: json.download_url
  }
}

export interface Login {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface Signup {
  email: string;
  password: string;
  passwordConfirmation: string;
}
