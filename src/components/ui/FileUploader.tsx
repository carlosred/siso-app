"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useRef } from "react";
import { Upload, File, X, CheckCircle2, Loader2 } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

interface FileUploaderProps {
  onUploadComplete: (storageId: Id<"_storage">) => void;
  label?: string;
}

export function FileUploader({ onUploadComplete, label }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const generateUploadUrl = useMutation(api.evaluations.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      onUploadComplete(storageId);
      setUploaded(true);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>}
      
      {!file ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-all"
        >
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
          <p className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Click para subir evidencia</p>
          <p className="text-xs text-slate-400 mt-1">PDF, JPG o PNG (máx 10MB)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,image/*"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <File className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
             <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          
          {uploaded ? (
            <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Subido</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setFile(null)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
              <button 
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Subir"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
