import React from 'react';

interface FileUploaderProps {
  onFileUpload: (data: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files) {
      console.error("No file selected or event object is undefined");
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);

          if (jsonData.Entity && jsonData.Entity.columns) {
            onFileUpload(jsonData.Entity); // Call the parent handler
          } else {
            console.error('Invalid JSON structure');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    } else {
      console.error("File is not selected");
    }
  };

  return <input type="file" accept=".json, .txt" onChange={handleFileUpload} />;
};

export default FileUploader;
