import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SendIcon from "@mui/icons-material/Send";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import UserIcon from "@mui/icons-material/Person";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  const navItems = useMemo(
    () => [
      { path: "/", icon: SendIcon, label: "Picks" },
      { path: "/leaderboard", icon: TrophyIcon, label: "Leaderboard" },
      { path: "/profile", icon: UserIcon, label: "Profile" },
    ],
    []
  );

  const handleChange = React.useCallback(
    (event, newValue) => {
      setValue(newValue);
      navigate(navItems[newValue].path);
    },
    [navigate, navItems]
  );

  useEffect(() => {
    const currentIndex = navItems.findIndex(
      (item) => item.path === location.pathname
    );
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [location.pathname, navItems]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-md"
      aria-label="Bottom Navigation"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Bottom Navigation"
        variant="fullWidth"
        textColor="inherit"
        indicatorColor="primary"
        centered
        sx={{
          "& .MuiTab-root": {
            minHeight: "64px",
            color: "gray",
            "&.Mui-selected": {
              color: "primary.main",
            },
          },
        }}
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Tab
              key={item.path}
              icon={<Icon sx={{ fontSize: 24 }} />}
              label={item.label}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "& .MuiTab-iconWrapper": {
                  marginBottom: "4px",
                },
              }}
            />
          );
        })}
      </Tabs>
    </nav>
  );
};

export default BottomNav;
