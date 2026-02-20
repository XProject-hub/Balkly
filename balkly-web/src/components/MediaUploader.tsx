"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, FileText, Film, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/svg+xml",
];

const ACCEPTED_DOC_TYPES = [
  "application/pdf",
];

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
];

function getFileIcon(file: File) {
  if (file.type.startsWith("video/")) return <Film className="h-8 w-8 text-blue-400" />;
  if (file.type === "application/pdf") return <FileText className="h-8 w-8 text-red-400" />;
  return <ImageIcon className="h-8 w-8 text-muted-foreground" />;
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

interface MediaUploaderProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptVideo?: boolean;
  acceptPdf?: boolean;
}

export default function MediaUploader({
  onUpload,
  maxFiles = 10,
  acceptVideo = false,
  acceptPdf = true,
}: MediaUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

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
    handleFiles(Array.from(e.dataTransfer.files));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, maxFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleFiles = (newFiles: File[]) => {
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        newErrors.push(`"${file.name}" je prevelik (max ${MAX_FILE_SIZE_MB}MB)`);
        continue;
      }
      validFiles.push(file);
    }

    setErrors(newErrors);

    const remainingSlots = maxFiles - files.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    const updatedFiles = [...files, ...filesToAdd];
    setFiles(updatedFiles);

    const newPreviews: (string | null)[] = [];
    let loadedCount = 0;

    filesToAdd.forEach((file) => {
      if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          loadedCount++;
          if (loadedCount === filesToAdd.length) {
            setPreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
        return;
      }
      newPreviews.push(null);
      loadedCount++;
      if (loadedCount === filesToAdd.length) {
        setPreviews((prev) => [...prev, ...newPreviews]);
      }
    });

    onUpload(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onUpload(updatedFiles);
  };

  const allAccepted = [
    ...ACCEPTED_IMAGE_TYPES,
    ...(acceptPdf ? ACCEPTED_DOC_TYPES : []),
    ...(acceptVideo ? ACCEPTED_VIDEO_TYPES : []),
  ].join(",");

  const formatLabels = [
    "JPG, PNG, GIF, WebP, AVIF, HEIC",
    ...(acceptPdf ? ["PDF"] : []),
    ...(acceptVideo ? ["MP4, MOV, AVI"] : []),
  ].join(" • ");

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
          accept={allAccepted}
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={files.length >= maxFiles}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">
            {isDragging ? "Pusti fajlove ovdje" : "Prevuci & pusti fajlove ovdje"}
          </p>
          <p className="text-sm text-muted-foreground mb-1">
            ili klikni za odabir • Max {maxFiles} fajlova • Max {MAX_FILE_SIZE_MB}MB po fajlu
          </p>
          <p className="text-xs text-muted-foreground mb-4 opacity-70">
            {formatLabels}
          </p>
          <Button type="button" variant="outline" disabled={files.length >= maxFiles}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Odaberi Fajlove
          </Button>
        </label>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}

      {/* Preview Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="relative group overflow-hidden">
              {previews[index] ? (
                <img
                  src={previews[index]!}
                  alt={`Preview ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square flex flex-col items-center justify-center gap-2 bg-muted/30 p-3">
                  {getFileIcon(file)}
                  <span className="text-xs text-muted-foreground text-center line-clamp-2 break-all">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                </div>
              )}

              <button
                onClick={() => removeFile(index)}
                type="button"
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>

              {index === 0 && file.type.startsWith("image/") && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
                  COVER
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {files.length} / {maxFiles} fajlova odabrano
      </p>
    </div>
  );
}
