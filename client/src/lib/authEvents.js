export const AUTH_REQUIRED_EVENT = 'auth:required'

export function triggerAuthRequired () {
  window.dispatchEvent(new Event(AUTH_REQUIRED_EVENT))
}
