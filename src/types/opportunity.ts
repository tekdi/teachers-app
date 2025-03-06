export interface Opportunity {
  id: string;
  title: string;
  description: string;
  // location: any;
  // is_remote: boolean;
  // opportunity_type: string;
  // experience_level: string;
  min_experience: number;
  min_salary: number;
  max_salary: string;
  category: any;
  company: string;
  skills: string[];
  no_of_candidates: string;
  status: string;
  created_at: string;
  updated_at: string;
  // organisation: string;
  role_type: string;
  // salary: string;
  work_nature:string;
  benefits:string;
  // stipend:string;
  // skillDetails:Array<any>;
  // work_experience:string;
  otherBenefits?:string;
  // is_remote:boolean;
  country:string;
  state:string;
  city:string;
}

export interface OpportunityList {
  id: string;
  title: string;
  description: string;
  location: any;
  is_remote: boolean;
  opportunity_type: string;
  experience_level: string;
  min_experience: number;
  min_salary: number;
  max_salary: string;
  category: any;
  company: string;
  skills: string[];
  no_of_candidates: string;
  status: string;
  created_at: string;
  updated_at: string;
  organisation: string;
  role_type: string;
  salary: string;
  work_nature:string;
  benefits:string;
  stipend:string;
  skillDetails:Array<any>;
  work_experience:string;
  otherBenefits?:string;
  country:string;
  state:string;
  city:string;
}

export type OpportunityFormData = Omit<Opportunity, "id" | "created_at" | "updated_at">

export interface OpportunityApplication {
  id: string
  opportunity_id: string
  user_id: string
  match_score: number
  feedback?: string
  youth_feedback?: string
  status_id: string
  applied_skills: string[]
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
}

export interface Organization {
  id: string
  name: string
  description: string
  website: string
}

