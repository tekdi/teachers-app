const API_BASE = process.env.NEXT_PUBLIC_MIDDLEWARE_URL

// API Configuration type
export type ApiConfig = {
  tenantId: string
  token: string
}

// Function to get token from localStorage
function getAuthConfig(): ApiConfig {
  return {
    tenantId: process.env.TENANT_ID!,
    token: localStorage.getItem("token") || "", // Retrieve token from localStorage
  }
}

// Generic API fetch function with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config = getAuthConfig()
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.token}`,
    tenantid: "ef99949b-7f3a-4a5f-806a-e67e683e38f3",
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

// Types for API responses
interface PaginatedResponse<T> {
    result:any
  data: T[]
  total: number
  page: number
  limit: number
  count: number
}

interface OpportunityFilters {
  industry?: string
  status?: string
  isRemote?: string
  location?: string
  category?: string
  created_by?: string,
  skills?: string
}

// API Functions
export async function getOpportunities(search = "", page = 1, filters: OpportunityFilters = {}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
    ...(search && { search }),
    ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined)),
  })

  const response = await fetchApi<PaginatedResponse<any>>(`/opportunity-service/opportunities?${params}`)

  return {
    items: response.result.data,
    total: response.total,
    totalPages: Math.ceil(response.total / 10),
    currentPage: page,
  }
}

export async function getOpportunity(id: string) {
  return fetchApi<any>(`/opportunity-service/opportunities/${id}`)
}

export async function createOpportunity(data: any) {
  return fetchApi<any>("/opportunity-service/opportunities", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateOpportunity(id: string, data: any) {
  return fetchApi<any>(`/opportunity-service/opportunities/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteOpportunity(id: string) {
  return fetchApi<void>(`/opportunity-service/opportunities/${id}/archive`, {
    method: "PATCH",
  })
}

export async function getLocations(search = "") {
  const params = new URLSearchParams({
    ...(search && { search }),
  })
  return fetchApi<any>(`/opportunity-service/locations?${params}`)
}

export async function getOrganizations() {
  return fetchApi<any>("/opportunity-service/organizations")
}

export async function getSkills() {
  return fetchApi<any>(`/opportunity-service/skills`)
}

export async function getCategories() {
  return fetchApi<any>(`/opportunity-service/categories`)
}

export async function getBenefits() {
  return fetchApi<any>(`/opportunity-service/benefits`)
}

export async function getLocation(params?: { country?: any; state?: any }) {
  const queryParams = new URLSearchParams(params as Record<string, string>).toString();
  const url = queryParams ? `/opportunity-service/locations/list?${queryParams}` : `/opportunity-service/locations/list`;

  return fetchApi<any>(url, {
    method: "POST",
  });
}

export async function getLocationCode(params?: { country?: any; state?: any; city?:any }) {
  const queryParams = new URLSearchParams(params as Record<string, string>).toString();
  const url = queryParams ? `/opportunity-service/locations?${queryParams}` : `/opportunity-service/locations/list`;

  return fetchApi<any>(url);
}

export async function applyToOpportunity(requestData?:any) {
  return fetchApi<any>("/opportunity-service/opportunity-applications", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export async function getAppliedUsers(opportunityId: any) {
  const params = new URLSearchParams({
    page: "1",
    limit: "100", // Adjust limit based on expected applicants
    opportunity_id: opportunityId,
  });

  return fetchApi<PaginatedResponse<any>>(`/opportunity-service/opportunity-applications?${params}`);
}

export async function getMappedByMe(userId: any) {
  const params = new URLSearchParams({
    page: "1",
    limit: "100",
    created_by: userId,
  });

  const response = await fetchApi<PaginatedResponse<any>>(`/opportunity-service/opportunity-applications?${params}`);
  return {
    items: response.result.data,
    total: response.total,
    totalPages: Math.ceil(response.total / 10),
    currentPage: 1,
  }
}

export const updateApplicationStatus = async (applicationId:string, newStatus:string) => {

  const body = JSON.stringify({ status_id: newStatus });

  return fetchApi<any>(`/opportunity-service/opportunity-applications/${applicationId}`, {
    method: "PUT",
    body: body,
  });

};

export async function fetchApplicationStatuses() {
  return fetchApi<any>(`/opportunity-service/application-statuses`)
}