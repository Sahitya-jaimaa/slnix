import React from "react";

interface ThemeSwitcherProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isDarkMode,
  onToggle,
}) => {
  return (
    <div className="flex items-center mb-4">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          checked={isDarkMode}
          onChange={onToggle}
        />
        <div className="w-14 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-inner"></div>
        <div
          className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform ${
            isDarkMode ? "translate-x-6" : ""
          }`}
        ></div>
      </label>
      <span className="ml-3 text-gray-800 dark:text-gray-200 font-semibold">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
    </div>
  );
};

export default ThemeSwitcher;
