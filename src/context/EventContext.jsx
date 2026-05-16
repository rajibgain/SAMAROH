import React, { createContext, useContext } from 'react';
import { useEvents } from '../hooks/useFirebaseEvents';

const EventContext = createContext();

export function EventProvider({ children }) {
  const eventData = useEvents();

  return (
    <EventContext.Provider value={eventData}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  return useContext(EventContext);
}
