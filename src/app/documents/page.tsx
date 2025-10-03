"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDocuments, uploadDocument, Document } from "@/lib/api";
import { useAppStore } from "@/store";

export default function DocumentsPage() {
  const { documents, setDocuments } = useAppStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocuments = await getDocuments();
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Optionally set an error state here to display to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // This useEffect will run when `isUploading` becomes true, and will poll for updates.
  useEffect(() => {
    if (!isUploading) {
      return;
    }

    const pollingInterval = setInterval(async () => {
      const freshDocuments = await getDocuments();
      setDocuments(freshDocuments);

      // If there are no more documents in a "processing" state, stop polling.
      const isStillProcessing = freshDocuments.some(doc => !doc.processed);
      if (!isStillProcessing) {
        setIsUploading(false); // This will stop the useEffect from running the interval again.
      }
    }, 5000); // Poll every 5 seconds.

    // Cleanup function to clear the interval when the component unmounts or `isUploading` changes.
    return () => clearInterval(pollingInterval);
  }, [isUploading, setDocuments]);


  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    // Create a temporary representation of the document for immediate UI feedback.
    const tempDoc = {
      s3_key: `temp-id-${Date.now()}`,
      filename: selectedFile.name,
      processed: false,
      size: selectedFile.size,
      last_modified: new Date().toISOString(),
    };
    setDocuments([tempDoc, ...documents]);

    // Set isUploading to true to kick off the polling useEffect.
    setIsUploading(true);

    try {
      // We call uploadDocument but expect it to time out.
      await uploadDocument(selectedFile);
    } catch (error) {
      // The timeout error is expected. We log it and let the polling handle the rest.
      console.warn(
        "Upload request may have timed out, which is expected. " +
        "Polling will continue in the background to check for the final status."
      );
    } finally {
      // Reset the file input regardless of the timeout.
      setSelectedFile(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload a new document</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                {selectedFile ? selectedFile.name : 'Select File'}
              </Button>
            </div>
            <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading documents...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.length > 0 ? (
                    documents.map((doc, index) => (
                      <TableRow key={doc.s3_key || index}>
                        <TableCell className="font-medium">{doc.filename}</TableCell>
                        <TableCell>{doc.processed ? "Processed" : "Processing..."}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
