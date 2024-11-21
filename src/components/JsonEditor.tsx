import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

interface JsonEditorProps {
  json: string;
  onChange: (value: string) => void;
  error: string | null;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ json, onChange, error }) => {
  return (
    <div className="w-full p-4 border rounded-md bg-gray-50">
      <h2 className="text-lg font-semibold">JSON Editor</h2>
      <AceEditor
        mode="json"
        theme="monokai"
        value={json}
        onChange={onChange}
        name="json-editor"
        fontSize={16}
        height="400px"
        width="100%"
        showPrintMargin={false}
        setOptions={{ useWorker: false }}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default JsonEditor;
