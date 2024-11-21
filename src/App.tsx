import React, { useState, useEffect } from "react";
import JsonEditor from "./components/JsonEditor";
import FormPreview from "./components/FormPreview";
import { validateSchema, FormSchema } from "./utils/schemaValidator";

const App: React.FC = () => {
  const [json, setJson] = useState(
    JSON.stringify(
      {
        formTitle: "Project Requirements Survey",
        formDescription: "Please fill out this survey about your project needs",
        fields: [
          {
            id: "name",
            type: "text",
            label: "Full Name",
            required: true,
            placeholder: "Enter your full name",
          },
          {
            id: "email",
            type: "email",
            label: "Email Address",
            required: true,
            placeholder: "you@example.com",
            validation: {
              pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
              message: "Please enter a valid email address",
            },
          },
        ],
      },
      null,
      2
    )
  );

  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Sync theme to localStorage and class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleJsonChange = (value: string) => {
    setJson(value);
    const validation = validateSchema(value);
    if (validation.valid) {
      setSchema(validation.data);
      setError(null);
    } else {
      setError(validation.error);
      setSchema(null);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopyMessage("Copied!");
      setTimeout(() => setCopyMessage(null), 2000);
    });
  };

  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "form-submission.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    // <div className="flex flex-col md:flex-row h-screen">
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <div className="w-full md:w-1/2 p-4 bg-gray-100">
        <JsonEditor json={json} onChange={handleJsonChange} error={error} />
      </div>
      {/* Form Preview Section */}
      <div className="w-full md:w-1/2 p-4 relative">
      <h1 className="text-lg font-semibold">Form Output</h1>
      {/* Buttons Section */}
      <div className="absolute top-4 right-4 flex gap-4">
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Copy JSON Button */}
        <button
          onClick={handleCopyJson}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
        >
          Copy Form JSON
        </button>

        {/* Download Submission Button */}
        <button
          onClick={handleDownloadJson}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800"
        >
          Download Form
        </button>
      </div>

      {copyMessage && (
        <p className="absolute top-16 right-4 text-green-600">
          {copyMessage}
        </p>
      )}
      <br></br>
      <hr></hr>
      {schema ? (
          <div className="relative">
            {/* Form Content */}
            <h1 className="text-2xl font-bold mb-2">{schema.formTitle}</h1>
            <p className="text-gray-600 mb-4">{schema.formDescription}</p>
            <FormPreview schema={schema.fields} />
          </div>
        ) : (
          <p className="text-gray-500">No valid schema provided</p>
        )}
      </div>
      <footer>
        <h2>Made by Harshit Raj</h2>
      </footer>
    </div>
  );
};

export default App;
