import React, { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunCode: (code: string) => void;
  fileName: string;
  selectedLanguage: { langCode: string; langName: string }; // Add selectedLanguage prop
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  onRunCode,
  fileName,
  selectedLanguage,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [formattedCode, setFormattedCode] = useState<string>(code);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      const codeData = {
        langCode: selectedLanguage.langCode, // Use the selected language code
        code: btoa(code), // Encode code in base64
        lines: code.split("\n").length,
        size: `${(new Blob([code]).size / 1024).toFixed(2)}kb`,
      };
      localStorage.setItem(fileName, JSON.stringify(codeData));
      alert(`File "${fileName}" saved to local storage!`);
    }
  };

  const formatCode = async () => {
    try {
      const formatted = await prettier.format(code, {
        parser: "babel",
        plugins: [parserBabel],
      });
      setFormattedCode(formatted);
      onCodeChange(formatted);
    } catch (error) {
      console.error("Error formatting code:", error);
    }
  };

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.value = code;
      setFormattedCode(code);
    }
  }, [code]);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm">
      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textAreaRef}
          className="w-full h-full p-4 bg-transparent text-gray-900 dark:text-gray-100 border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={code}
          onChange={(e) => {
            const newCode = e.target.value;
            onCodeChange(newCode);
            setFormattedCode(newCode);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={formatCode}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Format Code
        </button>
      </div>
      <div className="w-1/3 bg-gray-200 dark:bg-gray-700 p-4 overflow-auto">
        <h3 className="font-bold mb-2">Formatted Code</h3>
        <SyntaxHighlighter language="javascript" style={solarizedlight}>
          {typeof formattedCode === "string" ? formattedCode : ""}
        </SyntaxHighlighter>
        <button
          onClick={() => onRunCode(formattedCode)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Code
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
