import AsyncStorage from "@react-native-async-storage/async-storage";
import { PEOPLE_KEY, SESSION_KEY } from "../constants/storage";
import { getTodayKey } from "../utils/date";
import { createEmptySession } from "../utils/session";

export async function loadAppData() {
  const [rawPeople, rawSession] = await Promise.all([
    AsyncStorage.getItem(PEOPLE_KEY),
    AsyncStorage.getItem(SESSION_KEY),
  ]);

  const people = rawPeople ? JSON.parse(rawPeople) : [];
  const savedSession = rawSession ? JSON.parse(rawSession) : createEmptySession();
  const today = getTodayKey();

  return {
    people,
    session: savedSession.date === today ? savedSession : createEmptySession(),
  };
}

export function persistPeople(people) {
  return AsyncStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
}

export function persistSession(session) {
  return AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      ...session,
      date: getTodayKey(),
    }),
  );
}
