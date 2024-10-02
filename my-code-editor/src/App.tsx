import React, { useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import CodeEditor from "./components/CodeEditor";
import FileSidebar from "./components/FileSidebar";
import ThemeSwitcher from "./components/ThemeSwitcher";
import useLocalStorage from "./hooks/useLocalStorage";
import { Language } from "./types/Language";
import logo from "./assets/images/logo.png"; // Adjust the path as needed

const languages: Language[] = [
  { langCode: "JS", langName: "JavaScript" },
  { langCode: "TS", langName: "TypeScript" },
];

const App: React.FC = () => {
  const languages = [
    {
      langCode: "JS",
      langName: "JavaScript",
    },
    {
      langCode: "TS",
      langName: "TypeScript",
    },
    // More languages can be added here
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );
  const [folders, setFolders] = useLocalStorage<{ [key: string]: string[] }>(
    "folders",
    {}
  );
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [code, setCode] = useLocalStorage<string>("code", "");
  const [output, setOutput] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNewFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      setFolders((prev) => ({ ...prev, [folderName]: [] }));
      setCurrentFolder(folderName);
    }
  };

  const handleNewFile = () => {
    if (!currentFolder) {
      alert("Please select a folder first.");
      return;
    }

    const newFileName = prompt(
      "Enter file name (with .js, .jsx, .ts, or .tsx extension):"
    );
    if (newFileName) {
      const validExtensions = [".js", ".jsx", ".ts", ".tsx"];
      const isValidExtension = validExtensions.some((ext) =>
        newFileName.endsWith(ext)
      );
      if (isValidExtension) {
        setFolders((prev) => ({
          ...prev,
          [currentFolder]: [...(prev[currentFolder] || []), newFileName],
        }));
        setCurrentFile(newFileName);
        setCode("");
        setError(null);
      } else {
        setError("Invalid file extension. Please use .js, .jsx, .ts, or .tsx.");
      }
    }
  };

  const handleDeleteFile = (fileName: string) => {
    if (currentFolder) {
      setFolders((prev) => ({
        ...prev,
        [currentFolder]: prev[currentFolder].filter(
          (file) => file !== fileName
        ),
      }));
      if (currentFile === fileName) {
        setCurrentFile(null);
        setCode("");
      }
    }
  };

  const handleDeleteFolder = (folderName: string) => {
    setFolders((prev) => {
      const { [folderName]: _, ...rest } = prev;
      return rest;
    });
    if (currentFolder === folderName) {
      setCurrentFolder(null);
      setCurrentFile(null);
      setCode("");
    }
  };

  const handleFolderSelect = (folderName: string) => {
    setCurrentFolder(folderName);
    setCurrentFile(null);
    setCode("");
  };

  const handleFileSelect = (fileName: string) => {
    setCurrentFile(fileName);
    setCode(localStorage.getItem(`${currentFolder}/${fileName}`) || "");
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRunCode = () => {
    if (!currentFile) return;

    const selectedLanguageCode = selectedLanguage.langCode;

    if (
      (selectedLanguageCode === "TS" &&
        !currentFile.endsWith(".ts") &&
        !currentFile.endsWith(".tsx")) ||
      (selectedLanguageCode === "JS" &&
        !currentFile.endsWith(".js") &&
        !currentFile.endsWith(".jsx"))
    ) {
      setError("Selected language does not match the file extension.");
      return;
    }

    // Capture console output
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      setOutput((prevOutput) => prevOutput + args.join(" ") + "\n");
      originalConsoleLog(...args); // Retain the original console log functionality
    };

    try {
      setOutput(""); // Clear previous output
      const runCode = new Function(code);
      runCode();

      localStorage.setItem(`${currentFolder}/${currentFile}`, code);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput("Error running code: " + error.message);
    } finally {
      console.log = originalConsoleLog; // Restore original console log
    }
  };

  const handleSaveCode = () => {
    if (currentFile) {
      localStorage.setItem(`${currentFolder}/${currentFile}`, code);
      alert("Code saved!");
    } else {
      alert("No file selected to save.");
    }
  };

  const handleResetCode = () => {
    setCode("");
    setOutput(""); // Reset output as well
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark");
  };

  const isLanguageEnabled = () => {
    const selectedLanguageCode = selectedLanguage.langCode;
    if (!currentFile) return false;

    return (
      (selectedLanguageCode === "TS" && currentFile.endsWith(".ts")) ||
      (selectedLanguageCode === "JS" && currentFile.endsWith(".js"))
    );
  };

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}
    >
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-2" />
          <h1 className="text-2xl font-bold text-center flex-grow">
            Code Editor
          </h1>
        </div>
        <div className="flex items-center">
          <LanguageSelector
            languages={languages}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
            className={`${isDarkMode ? "bg-black text-white" : ""} rounded-md p-2`}
            style={{ minWidth: "120px" }}
          />
          <ThemeSwitcher isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </div>
      <div className="flex-grow flex shadow-md">
        <FileSidebar
          folders={folders}
          onDeleteFile={handleDeleteFile}
          onNewFile={handleNewFile}
          onFileSelect={handleFileSelect}
          onNewFolder={handleNewFolder}
          onFolderSelect={handleFolderSelect}
          onDeleteFolder={handleDeleteFolder}
        />
        <div
          className={`flex-1 p-6 overflow-y-auto ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
        >
          <h2 className="text-xl font-semibold mb-4">Edit Your Code</h2>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleSaveCode}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
            <button
              onClick={handleResetCode}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Reset
            </button>
            <button
              onClick={handleRunCode}
              className={`px-4 py-2 ${isLanguageEnabled() ? "bg-green-500" : "bg-gray-300 cursor-not-allowed"} text-white rounded`}
              disabled={!isLanguageEnabled()}
            >
              Run Code
            </button>
          </div>
          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            fileName={currentFile || "untitled"}
          />
        </div>
      </div>
      <div
        className={`p-6 border-t ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}
      >
        <h3
          className={`font-bold text-lg border-b mb-4 ${isDarkMode ? "border-gray-500" : "border-gray-300"}`}
        >
          Output:
        </h3>
        <div
          className={`overflow-auto h-48 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"} p-4 border`}
        >
          <pre className="whitespace-pre-wrap">
            {output || "No output to display."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
