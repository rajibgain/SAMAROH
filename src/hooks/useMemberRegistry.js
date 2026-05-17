import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import { generateMemberUid, normalizeMemberUid } from '../utils/memberUid';

export async function validateMemberUid(memberUid) {
  const normalized = normalizeMemberUid(memberUid);
  if (!normalized) return null;

  const regRef = doc(db, 'memberRegistry', normalized);
  const snap = await getDoc(regRef);
  // #region agent log
  fetch('http://127.0.0.1:7720/ingest/3a688ee9-fc10-45d0-85e8-c003ab167547',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c6c760'},body:JSON.stringify({sessionId:'c6c760',location:'useMemberRegistry.js:validateMemberUid',message:'uid lookup',data:{normalized,exists:snap.exists()},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
  // #endregion
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createMemberRegistryEntry({ memberUid, eventId, eventMemberId, name, coordinatorId }) {
  const normalized = normalizeMemberUid(memberUid);
  await setDoc(doc(db, 'memberRegistry', normalized), {
    memberUid: normalized,
    eventId,
    eventMemberId,
    name,
    coordinatorId,
    linkedAuthUid: null,
    createdAt: serverTimestamp(),
  });
  return normalized;
}

export async function createUniqueMemberUid() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = generateMemberUid();
    const existing = await getDoc(doc(db, 'memberRegistry', candidate));
    if (!existing.exists()) return candidate;
  }
  return `${generateMemberUid()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

export async function linkMemberRegistryToAuth(memberUid, authUid) {
  const normalized = normalizeMemberUid(memberUid);
  const regRef = doc(db, 'memberRegistry', normalized);
  const snap = await getDoc(regRef);
  if (!snap.exists()) {
    throw new Error('Invalid member UID. Ask your coordinator for the correct code.');
  }

  const data = snap.data();
  if (data.linkedAuthUid && data.linkedAuthUid !== authUid) {
    throw new Error('This member UID is already linked to another account.');
  }

  await updateDoc(regRef, {
    linkedAuthUid: authUid,
    lastLinkedAt: serverTimestamp(),
  });

  return { id: snap.id, ...data, linkedAuthUid: authUid };
}

export async function getRegistryByAuthUid(authUid) {
  if (!authUid) return null;
  const q = query(collection(db, 'memberRegistry'), where('linkedAuthUid', '==', authUid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const first = snap.docs[0];
  return { id: first.id, ...first.data() };
}
