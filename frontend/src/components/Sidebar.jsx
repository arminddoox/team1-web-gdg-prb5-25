// frontend/src/components/Sidebar.jsx
// Worked
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { 
  Home, 
  LayoutDashboard, 
  Target, 
  Settings, 
  Info, 
  Search,
  RotateCw,
  LogOut,
  User
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Target, label: "Habits", path: "/habits" },
  ];

  const bottomItems = [
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Info, label: "About Us", path: "/about" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Trigger field - always visible */}
      <div
        className="fixed left-0 top-0 w-[120px] h-screen z-40"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />

      {/* Sidebar - slides in/out */}
      <aside
        className={`fixed left-0 top-1/2 -translate-y-1/2 w-[250px] h-[750px] bg-[#2b2b2b] rounded-r-2xl shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-[250px]"
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="flex flex-col h-full p-5 text-white">
          {/* User section */}
          <div className="flex items-center gap-3 pb-5 border-b border-gray-600 mb-5">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              <User size={20} className="text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user?.username || "Username"}
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="text-gray-400" />
            </button>
            <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
              <RotateCw size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#1e1e1e] text-gray-300 pl-10 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>

          {/* Main navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom navigation */}
          <nav className="space-y-2 pt-5 border-t border-gray-600">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}