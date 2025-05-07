export interface UserProfile {
  _id: string;
  name: string;
  role: string;
  email: string;
  location: string;
  // starred: boolean;
  skills: string[];
  resume_url: string;
  createdAt: string;
}

export const dummyUsers: UserProfile[] = [
  { 
    _id: "1", 
    name: "Manan Parikh", 
    role: "Software Developer", 
    email: "mananrajeshb@umass.edu", 
    location: "NY", 
    // starred: true,
    skills: ["React", "Node"], 
    resume_url: "", 
    createdAt: "2024-01-01" 
  },
  { 
    _id: "2", 
    name: "Fiona", 
    role: "Software Developer", 
    email: "fiona@example.com", 
    location: "LA", 
    // starred: false, 
    skills: ["Python", "Django"], 
    resume_url: "", 
    createdAt: "2024-01-02" 
  },
];
