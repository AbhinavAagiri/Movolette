/**
 * The maker's credit line, shown centred at the bottom of every page.
 * Kept in one component so the landing page and the studio cannot drift.
 */
export function SiteCredit() {
  return (
    <div className="site-credit">
      <a href="https://abhinavaagiri.com" target="_blank" rel="noreferrer noopener">
        <span aria-hidden="true">~ </span>Abhinav Aagiri<span aria-hidden="true"> ~</span>
      </a>
    </div>
  );
}
