import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { createMemberRegistryEntry, createUniqueMemberUid } from './useMemberRegistry';
import {
  GUEST_STATUS,
  TASK_STATUS,
  TASK_PRIORITY,
  JOB_ROLES,
  EXPENSE_CATEGORIES,
  MEMBER_ROLES,
} from '../constants';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const createEvent = useCallback(async (eventData) => {
    await addDoc(collection(db, 'events'), {
      ...eventData,
      createdAt: serverTimestamp(),
      guests: [],
      tasks: [],
      expenses: [],
      schedule: [],
      members: [],
    });
  }, []);

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, updates);
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  return { events, loading, createEvent, deleteEvent, updateEvent };
};

// Hook for managing guests
export const useGuests = (eventId) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      setGuests(snapshot.data()?.guests || []);
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const addGuest = async (guestData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const newGuest = {
        id: Date.now(),
        ...guestData,
        status: GUEST_STATUS.PENDING,
        attended: false,
        checkedInAt: null,
      };
      await updateDoc(eventRef, {
        guests: [...guests, newGuest]
      });
    } catch (error) {
      console.error("Error adding guest: ", error);
    }
  };

  const updateGuest = async (guestId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedGuests = guests.map(g => g.id === guestId ? { ...g, ...updates } : g);
      await updateDoc(eventRef, { guests: updatedGuests });
    } catch (error) {
      console.error("Error updating guest: ", error);
    }
  };

  const deleteGuest = async (guestId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedGuests = guests.filter(g => g.id !== guestId);
      await updateDoc(eventRef, { guests: updatedGuests });
    } catch (error) {
      console.error("Error deleting guest: ", error);
    }
  };

  const markGuestAttended = async (guestId, attended = true) => {
    await updateGuest(guestId, {
      attended,
      checkedInAt: attended ? new Date().toISOString() : null,
    });
  };

  return { guests, loading, addGuest, updateGuest, deleteGuest, markGuestAttended };
};

// Hook for managing tasks
export const useTasks = (eventId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      setTasks(snapshot.data()?.tasks || []);
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const addTask = async (taskData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const newTask = {
        id: Date.now(),
        ...taskData,
        status: TASK_STATUS.PENDING,
        priority: taskData.priority || TASK_PRIORITY.MEDIUM,
        jobRole: taskData.jobRole || taskData.category || JOB_ROLES.OTHER,
        dependsOn: taskData.dependsOn || [],
      };
      await updateDoc(eventRef, {
        tasks: [...tasks, newTask]
      });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
      await updateDoc(eventRef, { tasks: updatedTasks });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      await updateDoc(eventRef, { tasks: updatedTasks });
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
};

// Hook for managing expenses
export const useExpenses = (eventId) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      setExpenses(snapshot.data()?.expenses || []);
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const addExpense = async (expenseData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const newExpense = { id: Date.now(), ...expenseData, category: expenseData.category || EXPENSE_CATEGORIES.DECORATION, date: new Date().toISOString() };
      await updateDoc(eventRef, {
        expenses: [...expenses, newExpense]
      });
    } catch (error) {
      console.error("Error adding expense: ", error);
    }
  };

  const updateExpense = async (expenseId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedExpenses = expenses.map(e => e.id === expenseId ? { ...e, ...updates } : e);
      await updateDoc(eventRef, { expenses: updatedExpenses });
    } catch (error) {
      console.error("Error updating expense: ", error);
    }
  };

  const deleteExpense = async (expenseId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedExpenses = expenses.filter(e => e.id !== expenseId);
      await updateDoc(eventRef, { expenses: updatedExpenses });
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  };

  return { expenses, loading, addExpense, updateExpense, deleteExpense };
};

// Hook for managing schedule
export const useSchedule = (eventId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      const scheduleData = snapshot.data()?.schedule || [];
      setSchedule(scheduleData.sort((a, b) => new Date(a.time) - new Date(b.time)));
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const addScheduleItem = async (itemData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const newItem = { id: Date.now(), ...itemData };
      await updateDoc(eventRef, {
        schedule: [...schedule, newItem]
      });
    } catch (error) {
      console.error("Error adding schedule item: ", error);
    }
  };

  const updateScheduleItem = async (itemId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedSchedule = schedule.map(s => s.id === itemId ? { ...s, ...updates } : s);
      await updateDoc(eventRef, { schedule: updatedSchedule });
    } catch (error) {
      console.error("Error updating schedule item: ", error);
    }
  };

  const deleteScheduleItem = async (itemId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedSchedule = schedule.filter(s => s.id !== itemId);
      await updateDoc(eventRef, { schedule: updatedSchedule });
    } catch (error) {
      console.error("Error deleting schedule item: ", error);
    }
  };

  return { schedule, loading, addScheduleItem, updateScheduleItem, deleteScheduleItem };
};

// Hook for managing family members
export const useMembers = (eventId) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      setMembers(snapshot.data()?.members || []);
      setLoading(false);
    });
    return unsubscribe;
  }, [eventId]);

  const addMember = async (memberData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      const eventData = eventSnap.data() || {};
      const memberUid = await createUniqueMemberUid();
      const memberId = Date.now();
      const newMember = {
        id: memberId,
        ...memberData,
        memberUid,
        authUid: null,
        jobRole: memberData.jobRole || memberData.role || JOB_ROLES.OTHER,
        isPresent: false,
        lastSeenAt: null,
        dependsOn: [],
        assignedTasks: [],
      };

      await updateDoc(eventRef, {
        members: [...(eventData.members || members), newMember],
      });

      await createMemberRegistryEntry({
        memberUid,
        eventId,
        eventMemberId: memberId,
        name: memberData.name,
        coordinatorId: eventData.coordinatorId,
      });

      return newMember;
    } catch (error) {
      console.error("Error adding member: ", error);
      throw error;
    }
  };

  const updateMember = async (memberId, updates) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedMembers = members.map(m => m.id === memberId ? { ...m, ...updates } : m);
      await updateDoc(eventRef, { members: updatedMembers });
    } catch (error) {
      console.error("Error updating member: ", error);
    }
  };

  const deleteMember = async (memberId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedMembers = members.filter(m => m.id !== memberId);
      await updateDoc(eventRef, { members: updatedMembers });
    } catch (error) {
      console.error("Error deleting member: ", error);
    }
  };

  const markMemberPresent = async (memberId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      const updatedMembers = members.map((m) =>
        m.id === memberId
          ? { ...m, isPresent: true, lastSeenAt: new Date().toISOString() }
          : m
      );
      await updateDoc(eventRef, { members: updatedMembers });
    } catch (error) {
      console.error('Error marking member present:', error);
    }
  };

  const setMemberDependencies = async (memberId, dependsOn) => {
    await updateMember(memberId, { dependsOn });
  };

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
    markMemberPresent,
    setMemberDependencies,
  };
};

export async function syncMemberPresenceAcrossEvents(authUid, memberUid) {
  if (!authUid || !memberUid) return;

  const eventsSnap = await getDocs(collection(db, 'events'));
  const now = new Date().toISOString();

  const updates = eventsSnap.docs.map(async (eventDoc) => {
    const data = eventDoc.data();
    const memberList = data.members || [];
    const hasMember = memberList.some((m) => m.memberUid === memberUid || m.authUid === authUid);
    if (!hasMember) return;

    const updatedMembers = memberList.map((m) => {
      if (m.memberUid !== memberUid && m.authUid !== authUid) return m;
      return {
        ...m,
        authUid,
        memberUid: m.memberUid || memberUid,
        isPresent: true,
        lastSeenAt: now,
      };
    });

    await updateDoc(doc(db, 'events', eventDoc.id), { members: updatedMembers });
  });

  await Promise.all(updates);
}