import { MoreVert, ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import users from "../../../data/users";
import Mesages from "./Messages";

const menus = [
  {
    name: "Profile",
    url: "/profile",
  },
  {
    name: "Privacy Policy",
    url: "/privacy-policy",
  },
  {
    name: "Settings",
    url: "/settings",
  },
  {
    name: "Logout",
    url: "/logout",
  },
];

export default function Sidebar({ user }) {
  const [actionSource, setActionSource] = useState(null);
  const [actionSourcePos, setActionSourcePos] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuTitle, setMenuTitle] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActionSource(null);

    const i = menus.findIndex((x) => x.url === location.pathname);
    setMenuTitle(menus[i]?.name || "");
  }, [location]);

  useEffect(() => {
    if (actionSource) {
      const rect = actionSource.getBoundingClientRect();
      setActionSourcePos({
        top: rect.top,
        left: rect.left,
      });
    } else {
      setActionSourcePos(null);
    }
  }, [actionSource]);

  return (
    <>
      <div className="main-sidebar max-h-full bg-sky-950 w-80">
        {/* Header */}
        <div className="flex min-w-full max-w-full h-16 bg-sky-900 shadow-xl items-center overflow-hidden">
          {/* Profile avatar */}
          {location.pathname === "/" && (
            <img
              alt={user.name}
              title={user.name}
              src={user.avatar}
              className="w-12 ml-2 rounded-full"
            />
          )}

          {location.pathname !== "/" && (
            <>
              <button
                className="rounded-full p-2 ml-2 hover:bg-gray-50/[.1]"
                onClick={() => navigate("/")}
              >
                <ArrowBack className="text-white" />
              </button>
              {menuTitle && (
                <span className="text-white ml-2 text-base">{menuTitle}</span>
              )}
            </>
          )}
          {/* Right side elments */}
          <div className="flex items-center w-fit ml-auto mr-2 gap-2">
            <button
              className="transition duration-150 ease-out"
              onClick={(sender) => {
                setActionSource(sender.target);
              }}
            >
              <MoreVert className="text-white" />
            </button>
          </div>
        </div>
        <Mesages />
      </div>

      {/* Menu */}
      {actionSourcePos && (
        <>
          <div
            className="action-wrapper fixed z-50 top-0 left-0 w-full h-full backdrop-blur rounded overflow-hidden"
            onClick={() => setActionSource(null)}
          ></div>
          <div
            className="fixed bg-sky-950 text-white py-2 rounded border-slate-500 border-2 px-2 flex-col flex text-left"
            style={{
              top: `${actionSourcePos.top}px`,
              left: `${actionSourcePos.left / 2}px`,
              zIndex: 300,
            }}
          >
            {menus.map((menu, i) => (
              <button
                key={i}
                className="text-left p-1 w-full hover:bg-sky-800 rounded px-2"
                onClick={() => navigate(menu.url)}
              >
                {menu.name}
              </button>
            ))}
          </div>
        </>
      )}
      {/* End of menu */}
    </>
  );
}
