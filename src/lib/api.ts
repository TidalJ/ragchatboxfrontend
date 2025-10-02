const API_BASE_URL = "https://s3gkl2w4tbuapg4gyuukdls4dy0pbqta.lambda-url.ap-southeast-2.on.aws";

export interface Document {
  id: string;
  filename: string;
  status: string;
}

const handleApiError = async (response: Response) => {
  const errorData = await response.json();
  let errorMessage = "An unexpected error occurred.";
  if (errorData.detail) {
    if (typeof errorData.detail === 'string') {
      errorMessage = errorData.detail;
    } else if (Array.isArray(errorData.detail)) {
      errorMessage = errorData.detail.map((err: { msg?: string }) => err.msg || JSON.stringify(err)).join(', ');
    } else {
      errorMessage = JSON.stringify(errorData.detail);
    }
  }
  return errorMessage;
};

export async function generateResponse(prompt: string): Promise<string> {
  if (!prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }
  try {
    const params = new URLSearchParams({
      prompt: prompt,
      use_rag: 'true',
      x_user_credits: 'secretkey'
    });

    const response = await fetch(`${API_BASE_URL}/generate?${params.toString()}`, {
      method: "POST",
      headers: {
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.response || "No response field in response";
  } catch (error: unknown) {
    console.error("Error generating response:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred during response generation.");
  }
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data.documents || [];
  } catch (error: unknown) {
    console.error("Error fetching documents:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred while fetching documents.");
  }
}

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: unknown) {
    console.error("Error uploading document:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred during document upload.");
  }
}
