"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptVideo?: boolean;
}

export default function MediaUploader({ 
  onUpload, 
  maxFiles = 10,
  acceptVideo = false 
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [files]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const remainingSlots = maxFiles - files.length;
    const filesToAdd = newFiles.slice(0, remainingSlots);

    if (filesToAdd.length > 0) {
      const updatedFiles = [...files, ...filesToAdd];
      setFiles(updatedFiles);

      // Generate previews
      filesToAdd.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews((prev) => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });

      onUpload(updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onUpload(updatedFiles);
  };

  const acceptTypes = acceptVideo 
    ? "image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/quicktime"
    : "image/jpeg,image/jpg,image/png,image/gif,image/webp";

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
      >
        <input
          type="file"
          multiple
          accept={acceptTypes}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={files.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer ${files.length >= maxFiles ? 'opacity-50' : ''}`}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">
            {isDragging ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse • Max {maxFiles} files
            {acceptVideo && " • Images and videos"}
          </p>
          <Button type="button" variant="outline" disabled={files.length >= maxFiles}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Choose Files
          </Button>
        </label>
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                  COVER
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {files.length} / {maxFiles} files uploaded
      </p>
    </div>
  );
}

