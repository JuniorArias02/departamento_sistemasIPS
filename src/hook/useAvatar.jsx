// src/hooks/useAvatar.js
export default function useAvatar(nombre = "", avatar = null) {
  if (avatar) return avatar;

  const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || "User")}&background=0D8ABC&color=fff&rounded=true&size=64`;
  return url;
}
