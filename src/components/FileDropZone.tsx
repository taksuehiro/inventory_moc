'use client';

import React, { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  label: string;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
}

export function FileDropZone({ 
  onFileSelect, 
  acceptedTypes, 
  label, 
  selectedFile, 
  onRemoveFile 
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {selectedFile ? (
        <div className="flex items-center justify-between p-4 border border-green-300 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <File className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-800">{selectedFile.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFile}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            ファイルをドラッグ&ドロップするか、クリックして選択してください
          </p>
          <p className="text-xs text-gray-500 mb-4">
            対応形式: {acceptedTypes}
          </p>
          <input
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInput}
            className="hidden"
            id={`file-input-${label}`}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById(`file-input-${label}`)?.click()}
          >
            ファイルを選択
          </Button>
        </div>
      )}
    </div>
  );
}


