export type EventName =
  | "page_view"
  | "error"
  | "auth_start"
  | "auth_success"
  | "auth_error"
  | "action_success"
  | "action_error";

export interface Event {
  name: EventName;
  properties?: Record<string, unknown>;
}
