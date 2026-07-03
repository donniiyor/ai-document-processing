import { DocumentDto } from "@app/shared";
import { API_URL } from "./env";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        credentials: "include",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        const message =
            typeof error?.message === "string"
                ? error.message
                : "Request failed";

        throw new Error(message);
    }

    return response.json();
}

export async function register(
    fullName: string,
    email: string,
    password: string,
) {
    return request<{ message: string }>("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fullName,
            email,
            password,
        }),
    });
}

export async function login(email: string, password: string) {
    return request<{ message: string }>("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
        }),
    });
}

export async function logout() {
    return request<{ message: string }>("/auth/logout", {
        method: "POST",
    });
}

export async function uploadDocument(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return request("/documents/upload", {
        method: "POST",
        body: formData,
    });
}

export async function getDocuments(): Promise<DocumentDto[]> {
    return request("/documents", {
        cache: "no-store",
    });
}

export async function chatWithDocument(documentId: string, question: string) {
    return request(`/documents/${documentId}/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
    });
}
