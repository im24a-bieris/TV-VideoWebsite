"use client";

import { useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  createdAt: string;
  passwordHash: string;
};

const USERS_STORAGE_KEY = "tv-video-users";
const CURRENT_USER_STORAGE_KEY = "tv-video-current-user";
const AUTH_CHANGE_EVENT = "auth:change";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function registerLocalUser(payload: { email: string; password: string; username: string }) {
  const email = payload.email.trim().toLowerCase();
  const password = payload.password.trim();
  const username = payload.username.trim();

  if (!email || !password || !username) {
    return { user: null, error: "Bitte fülle alle Pflichtfelder aus." } as const;
  }

  if (!validateEmail(email)) {
    return { user: null, error: "Bitte gib eine gültige E-Mail-Adresse ein." } as const;
  }

  if (password.length < 8) {
    return { user: null, error: "Das Passwort muss mindestens 8 Zeichen lang sein." } as const;
  }

  const users = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { user: null, error: "Diese E-Mail-Adresse ist bereits registriert." } as const;
  }

  const passwordHash = await hashPassword(password);
  const user: AuthUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email,
    username,
    avatar: null,
    createdAt: new Date().toISOString(),
    passwordHash,
  };

  users.push(user);
  writeStorage(USERS_STORAGE_KEY, users);
  writeStorage(CURRENT_USER_STORAGE_KEY, user);
  emitAuthChange();

  return { user, error: null } as const;
}

export async function loginLocalUser(payload: { email: string; password: string }) {
  const email = payload.email.trim().toLowerCase();
  const password = payload.password.trim();

  if (!email || !password) {
    return { user: null, error: "Bitte gib E-Mail und Passwort ein." } as const;
  }

  const users = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);
  const user = users.find((entry) => entry.email.toLowerCase() === email);

  if (!user) {
    return { user: null, error: "Diese E-Mail-Adresse ist nicht registriert." } as const;
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    return { user: null, error: "E-Mail oder Passwort ist falsch." } as const;
  }

  writeStorage(CURRENT_USER_STORAGE_KEY, user);
  emitAuthChange();

  return { user, error: null } as const;
}

export function getCurrentLocalUser() {
  return readStorage<AuthUser | null>(CURRENT_USER_STORAGE_KEY, null);
}

export function useLocalUser() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    const syncUser = () => setUser(getCurrentLocalUser());
    syncUser();
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
  }, []);

  return user;
}

export function logoutLocalUser() {
  writeStorage(CURRENT_USER_STORAGE_KEY, null);
  emitAuthChange();
}

export async function updateCurrentUserProfile(payload: { username?: string; avatar?: string | null }) {
  const currentUser = getCurrentLocalUser();

  if (!currentUser) {
    return { user: null, error: "Bitte melde dich zuerst an." } as const;
  }

  const users = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);
  const updatedUsers = users.map((user) => {
    if (user.id !== currentUser.id) {
      return user;
    }

    return {
      ...user,
      username: payload.username?.trim() || user.username,
      avatar: payload.avatar ?? user.avatar,
    } satisfies AuthUser;
  });

  const updatedUser = updatedUsers.find((user) => user.id === currentUser.id) ?? null;

  writeStorage(USERS_STORAGE_KEY, updatedUsers);
  writeStorage(CURRENT_USER_STORAGE_KEY, updatedUser);
  emitAuthChange();

  return { user: updatedUser, error: null } as const;
}

export async function changeCurrentUserPassword(newPassword: string) {
  const currentUser = getCurrentLocalUser();

  if (!currentUser) {
    return { error: "Bitte melde dich zuerst an." } as const;
  }

  if (newPassword.trim().length < 8) {
    return { error: "Das neue Passwort muss mindestens 8 Zeichen lang sein." } as const;
  }

  const users = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);
  const passwordHash = await hashPassword(newPassword.trim());
  const updatedUsers = users.map((user) => {
    if (user.id !== currentUser.id) {
      return user;
    }

    return { ...user, passwordHash } satisfies AuthUser;
  });

  writeStorage(USERS_STORAGE_KEY, updatedUsers);
  emitAuthChange();

  return { error: null } as const;
}

export function deleteCurrentUser() {
  const currentUser = getCurrentLocalUser();

  if (!currentUser) {
    return false;
  }

  const users = readStorage<AuthUser[]>(USERS_STORAGE_KEY, []);
  const remainingUsers = users.filter((user) => user.id !== currentUser.id);

  writeStorage(USERS_STORAGE_KEY, remainingUsers);
  writeStorage(CURRENT_USER_STORAGE_KEY, null);
  emitAuthChange();

  return true;
}
