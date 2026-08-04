"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  changeCurrentUserPassword,
  deleteCurrentUser,
  getCurrentLocalUser,
  logoutLocalUser,
  updateCurrentUserProfile,
} from "@/lib/auth/client";

function getInitials(username: string) {
  return username
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "P";
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getCurrentLocalUser>>(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    const syncUser = () => {
      const currentUser = getCurrentLocalUser();
      setUser(currentUser);
      setUsername(currentUser?.username ?? "");
      setAvatar(currentUser?.avatar ?? "");
    };

    syncUser();
    window.addEventListener("auth:change", syncUser);
    return () => window.removeEventListener("auth:change", syncUser);
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [router, user]);

  const displayName = useMemo(() => user?.username || user?.email || "Profil", [user]);

  if (!user) {
    return <main className="profile-page"><section className="profile-shell"><p className="subtitle">Lädt Profil…</p></section></main>;
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const result = await updateCurrentUserProfile({ username, avatar: avatar || null });

    if (result.error) {
      setError(result.error);
    } else {
      setMessage("Profil erfolgreich aktualisiert.");
      setUser(result.user);
    }

    setIsSaving(false);
  }

  async function handlePasswordChange(event: React.FormEvent) {
    event.preventDefault();
    setIsPasswordSaving(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Die neuen Passwörter stimmen nicht überein.");
      setIsPasswordSaving(false);
      return;
    }

    const result = await changeCurrentUserPassword(password);

    if (result.error) {
      setError(result.error);
    } else {
      setMessage("Passwort erfolgreich geändert.");
      setPassword("");
      setConfirmPassword("");
    }

    setIsPasswordSaving(false);
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "LÖSCHEN") {
      setError("Bitte gib exakt LÖSCHEN ein, um das Konto zu löschen.");
      return;
    }

    setIsDeleting(true);
    setError(null);

    const deleted = deleteCurrentUser();

    if (!deleted) {
      setError("Das Konto konnte nicht gelöscht werden.");
      setIsDeleting(false);
      return;
    }

    router.replace("/");
  }

  return (
    <main className="profile-page">
      <section className="profile-shell">
        <div className="profile-header">
          <Link href="/exercises" className="back-link">
            ← Zurück zu Übungen
          </Link>
          <button
            type="button"
            className="button profile-action-button"
            onClick={() => {
              logoutLocalUser();
              router.replace("/login?message=logged-out");
            }}
          >
            Abmelden
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-hero">
            <div className="profile-avatar" aria-hidden="true">
              {user.avatar ? <img src={user.avatar} alt="Profilbild" className="profile-avatar-image" /> : getInitials(user.username || user.email)}
            </div>
            <div>
              <p className="eyebrow">Profil</p>
              <h1 className="title">{displayName}</h1>
              <p className="subtitle">Verwalte dein Konto, dein Profilbild und deine Sicherheit.</p>
            </div>
          </div>

          {message ? <p className="form-message form-message-success">{message}</p> : null}
          {error ? <p className="form-message form-message-error">{error}</p> : null}

          <form onSubmit={handleSaveProfile} className="profile-form-card">
            <h2 className="profile-section-title">Profil bearbeiten</h2>
            <label>
              Benutzername
              <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Dein Name" />
            </label>
            <label>
              Profilbild-URL
              <input value={avatar} onChange={(event) => setAvatar(event.target.value)} placeholder="https://..." />
            </label>
            <button type="submit" className="button button-primary" disabled={isSaving}>
              {isSaving ? "Speichere..." : "Profil speichern"}
            </button>
          </form>

          <form onSubmit={handlePasswordChange} className="profile-form-card">
            <h2 className="profile-section-title">Passwort ändern</h2>
            <label>
              Neues Passwort
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mindestens 8 Zeichen" />
            </label>
            <label>
              Neues Passwort bestätigen
              <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Wiederholen" />
            </label>
            <button type="submit" className="button button-primary" disabled={isPasswordSaving}>
              {isPasswordSaving ? "Ändere Passwort..." : "Passwort ändern"}
            </button>
          </form>

          <div className="profile-form-card profile-info-card">
            <h2 className="profile-section-title">Kontoinformationen</h2>
            <div className="profile-info-row">
              <span>E-Mail</span>
              <strong>{user.email}</strong>
            </div>
            <div className="profile-info-row">
              <span>Mitglied seit</span>
              <strong>{new Date(user.createdAt).toLocaleDateString("de-DE")}</strong>
            </div>
          </div>

          <div className="profile-form-card">
            <h2 className="profile-section-title">Konto verwalten</h2>
            <button type="button" className="button button-danger" onClick={() => setShowDeleteConfirm(true)}>
              Konto löschen
            </button>
          </div>
        </div>
      </section>

      {showDeleteConfirm ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="profile-section-title">Konto wirklich löschen?</h3>
            <p>Diese Aktion kann nicht rückgängig gemacht werden. Gib exakt <strong>LÖSCHEN</strong> ein, um fortzufahren.</p>
            <input value={deleteInput} onChange={(event) => setDeleteInput(event.target.value)} placeholder="LÖSCHEN" />
            <div className="profile-actions-row">
              <button type="button" className="button" onClick={() => setShowDeleteConfirm(false)}>
                Abbrechen
              </button>
              <button type="button" className="button button-danger" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? "Lösche..." : "Konto löschen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
