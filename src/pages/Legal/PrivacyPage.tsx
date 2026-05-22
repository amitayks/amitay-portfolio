import { LegalLayout } from "./LegalLayout";

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p className="text-yellow-500/80 text-xs uppercase tracking-wide">
        Draft — final text pending legal review
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account: email, name, avatar, GitHub handle, bio, optional resume, optional social links.</li>
        <li>Authentication: session tokens managed by Supabase Auth.</li>
        <li>Activity: a log of changes you make to your profile fields.</li>
      </ul>
      <h2>Why</h2>
      <p>To run your Keisar Club account, assign you to projects, and (with your consent) display you publicly on case studies of work you contributed to.</p>
      <h2>Where it's stored</h2>
      <p>Supabase (Postgres + Storage), hosted in the region selected for the Keisar Club Supabase project. OAuth provider tokens are managed by Supabase Auth and are not persisted client-side.</p>
      <h2>Third parties</h2>
      <ul>
        <li>Supabase — database, auth, storage.</li>
        <li>GitHub / Google — OAuth identity providers.</li>
        <li>EmailJS — contact form delivery (no account data).</li>
      </ul>
      <h2>Your rights</h2>
      <p>You can request access, correction, or deletion of your data by contacting us. Deletion soft-deletes your profile and nulls personal fields; public project attributions are anonymized rather than retroactively rewritten unless you specifically request a hard-delete.</p>
      <h2>Contact</h2>
      <p>Email: amiteyk3@gmail.com</p>
    </LegalLayout>
  );
}
