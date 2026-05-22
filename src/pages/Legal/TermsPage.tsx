import { LegalLayout } from "./LegalLayout";

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-yellow-500/80 text-xs uppercase tracking-wide">
        Draft — final text pending legal review
      </p>
      <p>
        Welcome to Keisar Club. By using this site you agree to these terms. Keisar
        Club is an agency that signs client contracts directly and engages developers
        as per-project freelancers.
      </p>
      <h2>Accounts</h2>
      <p>
        Accounts are created by invitation. One person per account; impersonation is
        not allowed. You're responsible for what happens under your account.
      </p>
      <h2>Public attribution</h2>
      <p>
        When you ship work under Keisar Club we may credit you publicly on the case
        study for that project, subject to your account's attribution settings. After
        you leave Keisar Club, project credits remain by default but may be modified
        on request.
      </p>
      <h2>Termination</h2>
      <p>
        Either party may end the relationship at any time. Work in progress that has
        been delivered will be paid; future assignments cease.
      </p>
      <h2>Limitation of liability</h2>
      <p>To the maximum extent permitted by law, Keisar Club is not liable for indirect or consequential damages arising from use of this site.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Israel.</p>
    </LegalLayout>
  );
}
