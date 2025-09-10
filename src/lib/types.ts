export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  ownerId: string;
}

export interface Opportunity {
  _id: string;
  title: string;
  value: number;
  stage: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalLeads: number;
  totalOpportunities: number;
  totalUsers: number;
  pipelineValue: number;
}
