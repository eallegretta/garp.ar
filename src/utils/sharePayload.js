import { QR_VERSION } from "../constants/storage";
import { getTodayKey } from "./date";

function normalizeImportedPerson(person, index) {
  return {
    id: String(person?.id ?? `imported-${index}`),
    name: String(person?.name ?? `Persona ${index + 1}`).trim(),
  };
}

function normalizeImportedAttendee(personId, attendee) {
  return {
    personId,
    present: Boolean(attendee?.present),
    expense: Number(attendee?.expense || 0),
    cashPaid: Number(attendee?.cashPaid || 0),
    transferPaid: Number(attendee?.transferPaid || 0),
  };
}

export function buildSharePayload(people, session) {
  const payload = {
    type: "garpapp-share",
    version: QR_VERSION,
    exportedAt: new Date().toISOString(),
    people,
    session,
  };

  return JSON.stringify(payload);
}

export function parseSharePayload(rawValue) {
  const parsed = JSON.parse(rawValue);

  if (parsed?.type !== "garpapp-share" || !Array.isArray(parsed?.people) || !parsed?.session) {
    throw new Error("QR invalido");
  }

  const people = parsed.people
    .map(normalizeImportedPerson)
    .filter((person) => person.name.length > 0);

  const peopleIds = new Set(people.map((person) => person.id));
  const attendees = Object.entries(parsed.session.attendees ?? {}).reduce(
    (accumulator, [personId, attendee]) => {
      if (!peopleIds.has(personId)) {
        return accumulator;
      }

      accumulator[personId] = normalizeImportedAttendee(personId, attendee);
      return accumulator;
    },
    {},
  );

  return {
    people,
    session: {
      date: getTodayKey(),
      attendees,
    },
  };
}
