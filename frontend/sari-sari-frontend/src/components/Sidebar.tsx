import { useEffect, useState, type CSSProperties } from "react";
import axios from "axios";
import {
  getStoredProfile,
  getToken,
  logout,
  setStoredProfile,
} from "../api/auth";

interface SidebarProps {
  activePage:
    | "dashboard"
    | "categories"
    | "products"
    | "sales"
    | "utang"
    | "expenses"
    | "account";
}

interface CurrentUser {
  username: string;
  profileImage: string | null;
}

const API_URL = "http://localhost:3000";

const navItems = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard" },
  { key: "categories", href: "/categories", label: "Categories" },
  { key: "products", href: "/products", label: "Products" },
  { key: "sales", href: "/sales", label: "Sales" },
  { key: "utang", href: "/utang", label: "Utang" },
  { key: "expenses", href: "/expenses", label: "Expenses" },
  { key: "account", href: "/account", label: "Account Settings" },
] as const;

export default function Sidebar({ activePage }: SidebarProps) {
  const [user, setUser] = useState<CurrentUser>(() => {
    return getStoredProfile() || {
      username: "User",
      profileImage: null,
    };
  });
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const cachedProfile = getStoredProfile();
        const nextUser = {
          username:
            res.data?.username ||
            cachedProfile?.username ||
            "User",
          profileImage:
            res.data?.profileImage ??
            cachedProfile?.profileImage ??
            null,
        };
        setUser(nextUser);
        setStoredProfile(nextUser);
        setImageFailed(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMe();

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<CurrentUser>).detail;
      if (detail) {
        const nextUser = {
          username: detail.username || "User",
          profileImage: detail.profileImage || null,
        };
        setUser(nextUser);
        setStoredProfile(nextUser);
        setImageFailed(false);
        return;
      }

      fetchMe();
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const showImage = user.profileImage && !imageFailed;
  const fallbackLabel = "STORE";

  return (
    <aside style={ui.sidebar}>
      <div>
        <div style={ui.brand}>Sari-sari Store</div>

        <a href="/account" style={ui.profileCard}>
          {showImage ? (
            <img
              src={user.profileImage!}
              alt={`${user.username} profile`}
              style={ui.avatarImage}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div style={ui.avatarFallback}>{fallbackLabel}</div>
          )}

          <div style={ui.profileMeta}>
            <div style={ui.profileName}>{user.username}</div>
            <div style={ui.profileHint}>
              {showImage ? "Manage profile" : "Set profile image"}
            </div>
          </div>
        </a>

        <nav style={ui.nav}>
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{
                ...ui.navItem,
                ...(activePage === item.key ? ui.navActive : {}),
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <button style={ui.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}

const ui: { [key: string]: CSSProperties } = {
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "auto",
  },
  brand: {
    fontSize: "22px",
    fontWeight: 800,
    textAlign: "center",
    marginBottom: "24px",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    marginBottom: "24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(0,0,0,0.08)",
  },
  avatarImage: {
    width: "72px",
    height: "72px",
    borderRadius: "999px",
    objectFit: "cover",
    border: "3px solid rgba(255,255,255,0.35)",
  },
  avatarFallback: {
    width: "72px",
    height: "72px",
    borderRadius: "999px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(255,255,255,0.24), rgba(191,219,254,0.35))",
    color: "white",
    fontSize: "14px",
    fontWeight: 800,
    textAlign: "center",
    lineHeight: 1.2,
    border: "3px solid rgba(255,255,255,0.25)",
  },
  profileMeta: {
    minWidth: 0,
    flex: 1,
  },
  profileName: {
    fontWeight: 700,
    color: "white",
    wordBreak: "break-word",
    fontSize: "16px",
  },
  profileHint: {
    fontSize: "12px",
    color: "#bfdbfe",
    marginTop: "4px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  navItem: {
    padding: "12px 15px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
  },
  navActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontWeight: 600,
  },
  logoutBtn: {
    padding: "12px",
    background: "#644ceb",
    color: "white",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
  },
};
