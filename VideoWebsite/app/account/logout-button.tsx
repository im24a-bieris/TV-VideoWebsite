import { logout } from "../auth/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button type="submit" className="button account-logout-button">
        Abmelden
      </button>
    </form>
  );
}
