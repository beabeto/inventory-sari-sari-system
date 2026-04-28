import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
  type ChangeEvent,
} from "react";
import axios from "axios";
import { getToken, setStoredProfile } from "../api/auth";
import Sidebar from "../components/Sidebar";

export default function Account() {
  const API_URL = "http://localhost:3000";

  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const nextUsername = res.data?.username || "";
        const nextProfileImage = res.data?.profileImage || "";
        setUsername(nextUsername);
        setProfileImage(nextProfileImage);
        setStoredProfile({
          username: nextUsername || "User",
          profileImage: nextProfileImage || null,
        });
      } catch (err) {
        console.error(err);
        setMessage("Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_URL}/users/update-profile`,
        { username, profileImage },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      setMessage(res.data?.message || "Profile updated successfully");
      setStoredProfile({
        username: username || "User",
        profileImage: profileImage || null,
      });
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: {
            username,
            profileImage: profileImage || null,
          },
        }),
      );
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Profile update failed");
    }
  };

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setProfileImage(result);
      setSelectedFileName(file.name);
      setMessage("");
    };
    reader.readAsDataURL(file);
  };

  const clearProfileImage = () => {
    setProfileImage("");
    setSelectedFileName("");
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_URL}/users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      setMessage(res.data?.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div style={ui.wrapper}>
      <Sidebar activePage="account" />

      <main style={ui.main}>
        <header style={ui.header}>
          <h1 style={ui.title}>Account Settings</h1>
          <p style={ui.subtitle}>Manage your profile and security</p>
        </header>

        <div style={ui.grid}>
          <div style={ui.card}>
            <h3 style={ui.cardTitle}>Update Profile</h3>

            <form onSubmit={handleUpdateProfile} style={ui.form}>
              <input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={ui.input}
                disabled={loadingProfile}
              />

              <label style={ui.fileLabel}>
                Profile Image File
                <input
                  aria-label="Profile image file"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={ui.input}
                  disabled={loadingProfile}
                />
              </label>

              {selectedFileName && (
                <div style={ui.fileName}>Selected file: {selectedFileName}</div>
              )}

              {profileImage && (
                <div style={ui.previewBlock}>
                  <img
                    src={profileImage}
                    alt="Profile preview"
                    style={ui.previewImage}
                  />
                  <button
                    type="button"
                    style={ui.secondaryButton}
                    onClick={clearProfileImage}
                  >
                    Clear Image
                  </button>
                </div>
              )}

              <button type="submit" style={ui.button} disabled={loadingProfile}>
                Save Profile
              </button>
            </form>
          </div>

          <div style={ui.card}>
            <h3 style={ui.cardTitle}>Change Password</h3>

            <form onSubmit={handleChangePassword} style={ui.form}>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={ui.input}
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={ui.input}
              />

              <button type="submit" style={ui.button}>
                Change Password
              </button>
            </form>
          </div>
        </div>

        {message && <div style={ui.message}>{message}</div>}
      </main>
    </div>
  );
}

const ui: { [key: string]: CSSProperties } = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f4f7ff",
  },
  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  subtitle: {
    color: "#64748b",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "25px",
    maxWidth: "900px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    marginBottom: "15px",
    color: "#1e3a8a",
    fontSize: "18px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    color: "black",
    backgroundColor: "white",
  },
  button: {
    padding: "10px",
    background: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: "10px",
    background: "#e2e8f0",
    color: "#1e293b",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  previewBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  previewImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
  },
  fileName: {
    fontSize: "13px",
    color: "#475569",
  },
  fileLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 600,
  },
  message: {
    marginTop: "20px",
    padding: "12px",
    background: "#e0f2fe",
    color: "#0369a1",
    borderRadius: "8px",
    maxWidth: "900px",
  },
};
