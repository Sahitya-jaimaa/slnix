import React from "react";

interface Language {
  langCode: string;
  langName: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
  className?: string;
  style?: React.CSSProperties; // Add this line
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  className,
  style, // Add this line
}) => {
  return (
    <select
      className={`border p-2 rounded ${className}`}
      value={selectedLanguage.langCode}
      onChange={(e) =>
        onSelectLanguage(
          languages.find((lang) => lang.langCode === e.target.value)!
        )
      }
      style={style} // Use the style prop here
    >
      {languages.map((language) => (
        <option key={language.langCode} value={language.langCode}>
          {language.langName}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
