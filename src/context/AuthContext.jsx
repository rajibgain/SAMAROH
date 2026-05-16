import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import {
  validateMemberUid,
  linkMemberRegistryToAuth,
  getRegistryByAuthUid,
} from '../hooks/useMemberRegistry';
import { syncMemberPresenceAcrossEvents } from '../hooks/useFirebaseEvents';
import { normalizeMemberUid } from '../utils/memberUid';

const AuthContext = createContext();

async function ensureUserDoc(uid, data) {
  const userRef = doc(db, 'users', uid);
  const existing = await getDoc(userRef);
  if (!existing.exists()) {
    await setDoc(userRef, data);
    return data;
  }
  return existing.data();
}

async function linkMemberAccount(authUser, memberUid, name) {
  const normalized = normalizeMemberUid(memberUid);
  const registry = await linkMemberRegistryToAuth(normalized, authUser.uid);

  await ensureUserDoc(authUser.uid, {
    email: authUser.email,
    role: 'member',
    name: name || authUser.displayName || registry.name,
    memberUid: normalized,
    createdAt: new Date(),
    profileComplete: true,
  });

  await syncMemberPresenceAcrossEvents(authUser.uid, normalized);
  return registry;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [memberUid, setMemberUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserRole(data.role);
            setMemberUid(data.memberUid || null);
            if (data.role === 'member' && data.memberUid) {
              await syncMemberPresenceAcrossEvents(currentUser.uid, data.memberUid);
            }
          } else {
            const registry = await getRegistryByAuthUid(currentUser.uid);
            if (registry) {
              setUserRole('member');
              setMemberUid(registry.memberUid);
            }
          }
        } catch (err) {
          console.error('Error fetching user role:', err);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setMemberUid(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, role, name, options = {}) => {
    try {
      setError(null);

      if (role === 'member') {
        const uidInput = options.memberUid;
        const registry = await validateMemberUid(uidInput);
        if (!registry) {
          throw new Error('Invalid member UID. Use the code shared by your coordinator.');
        }
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, {
        displayName: name,
      });

      if (role === 'member') {
        await linkMemberAccount(result.user, options.memberUid, name);
      } else {
        await setDoc(doc(db, 'users', result.user.uid), {
          email,
          role,
          name,
          createdAt: new Date(),
          profileComplete: false,
        });
      }

      setUser(result.user);
      setUserRole(role);
      if (role === 'member') {
        setMemberUid(normalizeMemberUid(options.memberUid));
      }
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password, options = {}) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserRole(data.role);
        setMemberUid(data.memberUid || null);

        if (data.role === 'member') {
          const uidToUse = options.memberUid || data.memberUid;
          if (!uidToUse) {
            await signOut(auth);
            throw new Error('Member UID is required. Enter the code from your coordinator.');
          }
          const registry = await validateMemberUid(uidToUse);
          if (!registry) {
            throw new Error('Invalid member UID. Use the code shared by your coordinator.');
          }
          await linkMemberAccount(result.user, uidToUse, data.name);
          setMemberUid(normalizeMemberUid(uidToUse));
        }
      } else if (options.role === 'member' && options.memberUid) {
        await linkMemberAccount(result.user, options.memberUid);
        setUserRole('member');
        setMemberUid(normalizeMemberUid(options.memberUid));
      }

      setUser(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithGoogle = async (role, options = {}) => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const authUser = result.user;

      const userDoc = await getDoc(doc(db, 'users', authUser.uid));

      if (role === 'member') {
        const uidInput = options.memberUid;
        if (!uidInput) {
          throw new Error('Member UID is required before Google sign-in.');
        }
        const registry = await validateMemberUid(uidInput);
        if (!registry) {
          throw new Error('Invalid member UID. Use the code shared by your coordinator.');
        }
        await linkMemberAccount(authUser, uidInput, authUser.displayName);
        setUserRole('member');
        setMemberUid(normalizeMemberUid(uidInput));
      } else if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', authUser.uid), {
          email: authUser.email,
          role: 'coordinator',
          name: authUser.displayName || 'Coordinator',
          createdAt: new Date(),
          profileComplete: false,
        });
        setUserRole('coordinator');
      } else {
        const data = userDoc.data();
        setUserRole(data.role);
        setMemberUid(data.memberUid || null);
      }

      setUser(authUser);
      return authUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const checkMemberUid = async (memberUid) => {
    return validateMemberUid(memberUid);
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setMemberUid(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        memberUid,
        loading,
        error,
        signup,
        login,
        loginWithGoogle,
        checkMemberUid,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
