import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faFile } from "@fortawesome/free-solid-svg-icons";

interface FileSidebarProps {
  folders: { [key: string]: string[] };
  onDeleteFile: (fileName: string) => void;
  onNewFile: () => void;
  onNewFolder: () => void;
  onFileSelect: (fileName: string) => void;
  onFolderSelect: (folderName: string) => void;
  onDeleteFolder: (folderName: string) => void;
}

const FileSidebar: React.FC<FileSidebarProps> = ({
  folders,
  onDeleteFile,
  onNewFile,
  onNewFolder,
  onFileSelect,
  onFolderSelect,
  onDeleteFolder,
}) => {
  return (
    <div className="w-1/4 border-r p-4">
      <h2 className="font-bold text-lg">Files</h2>
      <button
        onClick={onNewFolder}
        className="mb-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        New Folder
      </button>
      {Object.keys(folders).length > 0 && (
        <button
          onClick={onNewFile}
          className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
        >
          New File
        </button>
      )}
      <div>
        {Object.keys(folders).length === 0 ? (
          <p>No folders available.</p>
        ) : (
          Object.keys(folders).map((folder) => (
            <div key={folder} className="mb-4">
              <div className="flex justify-between items-center">
                <h3
                  onClick={() => onFolderSelect(folder)}
                  className="font-semibold cursor-pointer hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={faFolder} className="mr-2" />
                  {folder}
                </h3>
                <button
                  onClick={() => onDeleteFolder(folder)}
                  className="text-red-500 text-sm"
                >
                  Delete Folder
                </button>
              </div>
              <ul className="ml-4">
                {folders[folder].map((file) => (
                  <li key={file} className="flex justify-between items-center">
                    <span
                      onClick={() => onFileSelect(file)}
                      className="cursor-pointer hover:text-blue-600"
                    >
                      <FontAwesomeIcon icon={faFile} className="mr-2" />
                      {file}
                    </span>
                    <button
                      onClick={() => onDeleteFile(file)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileSidebar;
