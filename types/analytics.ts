export type EventName = 
  | 'page_view'
  | 'error'
  | 'auth_success'
  | 'auth_error'
  | 'action_success'
  | 'action_error';

export type Event = {
  name: EventName;
  properties?: Record<string, unknown>;
}; 