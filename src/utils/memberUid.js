const UID_PREFIX = 'SMR';
const UID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateMemberUid() {
  let code = '';
  for (let i = 0; i < 8; i += 1) {
    code += UID_CHARS[Math.floor(Math.random() * UID_CHARS.length)];
  }
  return `${UID_PREFIX}-${code}`;
}

export function normalizeMemberUid(value) {
  return String(value || '').trim().toUpperCase();
}
