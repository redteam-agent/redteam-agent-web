/**
 * REST API client for RedTeam Agent API
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface CreateSessionRequest {
  github_org: string
  github_repo: string
  gcp_project_id: string
  gcp_region: string
  gcp_service_name: string
}

interface StartRunRequest {
  app_name: string
  app_description: string
  app_url: string
  additional_context?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  setToken(token: string) {
    this.token = token
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Sessions
  async createSession(data: CreateSessionRequest) {
    return this.fetch('/api/v1/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSession(id: string) {
    return this.fetch(`/api/v1/sessions/${id}`)
  }

  // Runs
  async startRun(sessionId: string, data: StartRunRequest) {
    return this.fetch(`/api/v1/sessions/${sessionId}/runs`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRun(id: string) {
    return this.fetch(`/api/v1/runs/${id}`)
  }

  async getRunSteps(id: string) {
    return this.fetch(`/api/v1/runs/${id}/steps`)
  }

  async abortRun(id: string) {
    return this.fetch(`/api/v1/runs/${id}/abort`, {
      method: 'POST',
    })
  }

  // Documents
  async uploadDocument(sessionId: string, file: File, docType: string) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', docType)

    const headers: HeadersInit = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(
      `${this.baseUrl}/api/v1/sessions/${sessionId}/documents`,
      {
        method: 'POST',
        headers,
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async listDocuments(sessionId: string) {
    return this.fetch(`/api/v1/sessions/${sessionId}/documents`)
  }
}

export const apiClient = new ApiClient(API_URL)
