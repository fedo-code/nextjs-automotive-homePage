import { cookies } from "next/headers";
import AdminAccessClient from "./AdminAccessClient";
import { ADMIN_SESSION_COOKIE_NAME } from "../../lib/admin-token";
import { getAdminFromSessionToken } from "../../lib/admin-auth";

export const runtime = "nodejs";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminSessionToken = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const admin = await getAdminFromSessionToken(adminSessionToken);

  return (
    <AdminAccessClient
      initialAdmin={admin}
      initialIsAdmin={Boolean(admin)}
    />
  );
}
