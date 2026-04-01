import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import { FiBell, FiBriefcase, FiCamera } from "react-icons/fi";
import { MdOutlineBusiness } from "react-icons/md";

function Profile() {
  const [form, setForm] = useState({
    fullName: "Rudra Sharma",
    role: "HR Manager",
    email: "Rudra87@gmail.com",
    company: "TechCorp pvt ltd",
  });

  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyInterviews, setNotifyInterviews] = useState(true);

  /** Local preview URL from picked file (revoked on change/unmount). */
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const avatarFileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  function openAvatarPicker() {
    avatarFileInputRef.current?.click();
  }

  function handleAvatarFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    setAvatarPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    // wire API later
  }

  return (
    <div className="rec-profile">
      <header className="rec-profile-top">
        <div className="rec-profile-title-block">
          <h1 className="rec-profile-title">Profile</h1>
          <p className="rec-profile-subtitle">Manage your account settings</p>
        </div>
        <button
          type="button"
          className="rec-profile-bell"
          aria-label="Notifications"
        >
          <FiBell className="rec-profile-bell-icon" aria-hidden />
          <span className="rec-profile-bell-dot" aria-hidden />
        </button>
      </header>

      <form className="rec-profile-card" onSubmit={handleSave} noValidate>
        <div className="rec-profile-card-head">
          <div className="rec-profile-avatar-wrap">
            <input
              ref={avatarFileInputRef}
              type="file"
              accept="image/*"
              className="rec-profile-avatar-file"
              tabIndex={-1}
              aria-hidden
              onChange={handleAvatarFileChange}
            />
            <div
              className="rec-profile-avatar"
              aria-hidden={Boolean(avatarPreviewUrl)}
            >
              {avatarPreviewUrl ? (
                <img
                  src={avatarPreviewUrl}
                  alt="Profile photo preview"
                  className="rec-profile-avatar-img"
                />
              ) : (
                <span className="rec-profile-avatar-initials">RS</span>
              )}
            </div>
            <button
              type="button"
              className="rec-profile-avatar-cam"
              aria-label="Choose profile photo"
              onClick={openAvatarPicker}
            >
              <FiCamera aria-hidden />
            </button>
          </div>
          <div className="rec-profile-identity">
            <h2 className="rec-profile-name">Rudra Sharma</h2>
            <p className="rec-profile-line">
              <FiBriefcase className="rec-profile-line-ico" aria-hidden />
              HR Manager
            </p>
            <p className="rec-profile-line">
              <MdOutlineBusiness className="rec-profile-line-ico" aria-hidden />
              TechCorp pvt ltd
            </p>
          </div>
        </div>

        <div className="rec-profile-fields">
          <label className="rec-profile-field">
            <span className="rec-profile-label">Full Name</span>
            <input
              name="fullName"
              className="rec-profile-input"
              value={form.fullName}
              onChange={handleChange}
              autoComplete="name"
            />
          </label>
          <label className="rec-profile-field">
            <span className="rec-profile-label">Role</span>
            <input
              name="role"
              className="rec-profile-input"
              value={form.role}
              onChange={handleChange}
              autoComplete="organization-title"
            />
          </label>
          <label className="rec-profile-field">
            <span className="rec-profile-label">Email</span>
            <input
              name="email"
              type="email"
              className="rec-profile-input"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </label>
          <label className="rec-profile-field">
            <span className="rec-profile-label">Company</span>
            <input
              name="company"
              className="rec-profile-input"
              value={form.company}
              onChange={handleChange}
              autoComplete="organization"
            />
          </label>
        </div>

        <div className="rec-profile-actions">
          <button type="submit" className="rec-profile-save">
            Save Changes
          </button>
        </div>
      </form>

      <section className="rec-profile-card rec-profile-notify" aria-labelledby="notify-heading">
        <div className="rec-profile-notify-head">
          <FiBell className="rec-profile-notify-bell" aria-hidden />
          <h2 id="notify-heading" className="rec-profile-notify-title">
            Notifications
          </h2>
        </div>

        <ul className="rec-profile-notify-list">
          <li className="rec-profile-notify-row">
            <div className="rec-profile-notify-copy">
              <span className="rec-profile-notify-name">New Applications</span>
              <span className="rec-profile-notify-desc">
                Get notified when candidates apply.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifyApplications}
              className={`rec-toggle ${notifyApplications ? "is-on" : ""}`}
              onClick={() => setNotifyApplications((v) => !v)}
            >
              <span className="rec-toggle-knob" />
            </button>
          </li>
          <li className="rec-profile-notify-row">
            <div className="rec-profile-notify-copy">
              <span className="rec-profile-notify-name">Interview Reminders</span>
              <span className="rec-profile-notify-desc">
                Remind before scheduled interviews.
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifyInterviews}
              className={`rec-toggle ${notifyInterviews ? "is-on" : ""}`}
              onClick={() => setNotifyInterviews((v) => !v)}
            >
              <span className="rec-toggle-knob" />
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Profile;
