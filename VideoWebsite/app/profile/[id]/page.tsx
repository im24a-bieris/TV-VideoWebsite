import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  if (!viewer) {
    redirect("/login");
  }

  const { data, error } = await createAdminClient().auth.admin.getUserById(id);

  if (error || !data.user) {
    notFound();
  }

  const profileUser = data.user;
  const firstName = typeof profileUser.user_metadata.first_name === "string" ? profileUser.user_metadata.first_name : "";
  const lastName = typeof profileUser.user_metadata.last_name === "string" ? profileUser.user_metadata.last_name : "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Mitglied";
  const phone = typeof profileUser.user_metadata.phone === "string" ? profileUser.user_metadata.phone : "";
  const instagram = typeof profileUser.user_metadata.instagram === "string" ? profileUser.user_metadata.instagram : "";

  return (
    <main className="content-page">
      <section className="content-shell">
        <div className="page-heading">
          <p className="eyebrow">Profil</p>
          <h1 className="content-title">{displayName}</h1>
        </div>

        <div className="upload-form">
          <dl className="account-details">
            <div>
              <dt>E-Mail</dt>
              <dd>{profileUser.email}</dd>
            </div>
            <div>
              <dt>Telefonnummer</dt>
              <dd>{phone || "Nicht angegeben"}</dd>
            </div>
            <div>
              <dt>Instagram</dt>
              <dd>{instagram || "Nicht angegeben"}</dd>
            </div>
          </dl>
        </div>

        <Link href="/videos" className="back-link">
          &larr; Zurück
        </Link>
      </section>
    </main>
  );
}
