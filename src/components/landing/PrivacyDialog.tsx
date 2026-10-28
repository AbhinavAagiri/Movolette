import { Dialog } from '../Dialog';

interface PrivacyDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The plain-language policy behind the footer's "[Privacy & Terms]" link.
 * It lives in the shared Dialog so it inherits the same entrance, focus trap
 * and Escape handling as every other window in the app.
 */
export function PrivacyDialog({ open, onClose }: PrivacyDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      eyebrow="Legal"
      title="Privacy Policy & Terms of Use"
      panelClassName="dialog--pop"
      description="Movolette is a free, non-commercial animation studio built for educational and web development purposes."
    >
      <div className="legal">
        <section className="legal__section">
          <h3 className="legal__heading mono">
            <span aria-hidden="true">01</span> Data &amp; Privacy
          </h3>
          <ul className="legal__list">
            <li>
              <strong>Local Storage:</strong> We do not collect, track, or store any personal information, IP
              addresses, or analytical data on a remote server.
            </li>
            <li>
              <strong>No Accounts:</strong> There are no user accounts, sign-ups, or login requirements.
            </li>
            <li>
              <strong>Device-Only:</strong> All interface configurations, custom cubic-bezier curves, animation
              parameters, and tuning preferences are stored exclusively on your own device using local browser
              storage. No tracking pixels or advertising cookies are utilized.
            </li>
          </ul>
        </section>

        <section className="legal__section">
          <h3 className="legal__heading mono">
            <span aria-hidden="true">02</span> Terms of Use
          </h3>
          <ul className="legal__list">
            <li>
              <strong>"As Is" Provision:</strong> This software utility is provided "as is" without warranties of
              any kind, explicit or implied.
            </li>
            <li>
              <strong>Code Export:</strong> You are free to export and utilize the generated HTML, CSS, and
              JavaScript presets for personal or commercial projects.
            </li>
            <li>
              <strong>Accountability:</strong> The developer is not liable for any rendering glitches, code
              compatibility issues, or production bugs that may arise from using exported assets.
            </li>
          </ul>
        </section>
      </div>
    </Dialog>
  );
}
