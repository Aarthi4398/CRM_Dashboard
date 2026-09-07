import type { CalendarEvent, CRMState } from "../types";

export const FEATURED_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "calendar-event-conf", title: "Event Conf.", date: "2026-08-24", time: "10:00", category: "Meeting", attendees: 12, relatedTo: "CRM" },
  { id: "calendar-meeting", title: "Meeting", date: "2026-08-25", time: "11:30", category: "Call", attendees: 4, relatedTo: "Sales" },
  { id: "calendar-workshop", title: "Workshop", date: "2026-08-26", time: "14:00", category: "Deadline", attendees: 8, relatedTo: "Marketing" },
];

const featuredIds = new Set(FEATURED_CALENDAR_EVENTS.map((event) => event.id));

export function mergeCalendarEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...FEATURED_CALENDAR_EVENTS, ...events.filter((event) => !featuredIds.has(event.id))];
}

export function upsertCalendarEvent(state: CRMState, event: CalendarEvent, isNew: boolean): CRMState {
  if (isNew) return { ...state, events: [...state.events, event] };
  const replaced = state.events.map((item) => item.id === event.id ? event : item);
  const promoteDemo = featuredIds.has(event.id) && !state.events.some((item) => item.id === event.id);
  return { ...state, events: promoteDemo ? [...replaced, event] : replaced };
}

export function deleteCalendarEvent(state: CRMState, id: string): CRMState {
  return { ...state, events: state.events.filter((event) => event.id !== id) };
}
