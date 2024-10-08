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
  { langCode: "HTML", langName: "HTML" },
  { langCode: "CSS", langName: "CSS" },
];

const App: React.FC = () => {
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

    const newFileName = prompt("Enter file name (with appropriate extension):");
    if (newFileName) {
      const validExtensions = [".js", ".jsx", ".ts", ".tsx", ".html", ".css"];
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
        setError(
          "Invalid file extension. Please use .js, .jsx, .ts, .tsx, .html, or .css."
        );
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
    if (!currentFile) {
      alert("Please save your file before running the code.");
      return;
    }

    // Check if the code is saved
    const savedCode = localStorage.getItem(`${currentFolder}/${currentFile}`);
    if (!savedCode) {
      alert("Please save your file before running the code.");
      return;
    }

    // Capture console output
    const originalConsoleLog = console.log;
    console.log = (...args: any[]) => {
      setOutput((prevOutput) => prevOutput + args.join(" ") + "\n");
      originalConsoleLog(...args);
    };

    try {
      setOutput(""); // Clear previous output

      if (selectedLanguage.langCode === "HTML") {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(code);
          newWindow.document.close();
          newWindow.focus();
        }
      } else if (selectedLanguage.langCode === "CSS") {
        const styleElement = document.createElement("style");
        styleElement.textContent = code;
        document.head.appendChild(styleElement);
      } else {
        const runCode = new Function(code);
        runCode();
      }

      localStorage.setItem(`${currentFolder}/${currentFile}`, code);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error running code:", err);
        setOutput("Error running code: " + err.message);
      } else {
        console.error("Unknown error:", err);
        setOutput("An unknown error occurred.");
      }
    } finally {
      console.log = originalConsoleLog; // Restore original console log
    }
  };

  const handleSaveCode = () => {
    if (currentFile) {
      localStorage.setItem(`${currentFolder}/${currentFile}`, code);
      alert("Code saved!");
    } else {
      alert("Select the file to be saved.");
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

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="flex justify-between items-center p-4 flex-wrap">
        <div className="flex items-center flex-grow">
          <img src={logo} alt="Logo" className="h-12 w-12 mr-2" />
          <h1 className="text-2xl font-bold text-center flex-grow">
            Code Editor
          </h1>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
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
          className={`flex-1 p-4 md:p-6 overflow-y-auto ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Edit Your Code</h2>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 mb-4">
            <button
              onClick={handleSaveCode}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded mb-2 md:mb-0 md:mr-2"
            >
              Save
            </button>
            <button
              onClick={handleResetCode}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded mb-2 md:mb-0 md:mr-2"
            >
              Reset
            </button>
            <button
              onClick={handleRunCode}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded"
            >
              Run Code
            </button>
          </div>
          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            onRunCode={handleRunCode}
            fileName={currentFile || "untitled"}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </div>
      <div
        className={`p-6 border-t ${
          isDarkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3
          className={`font-bold text-lg border-b mb-4 ${
            isDarkMode ? "border-gray-500" : "border-gray-300"
          }`}
        >
          Output:
        </h3>
        <div
          className={`overflow-auto h-48 rounded-lg shadow-lg ${
            isDarkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800"
          } p-4 border`}
        >
          <pre className="whitespace-pre-wrap">
            {output || "Output to be displayed."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
