export interface User {
  id: string;
  email: string;
  name: string;
  profileImage: string;
  uselessnessScore: number;
  joinDate: Date;
  lastActive: Date;
  profileViews: number;
  skills: UselessSkill[];
  workExperience: WorkExperience[];
  endorsements: Endorsement[];
  badges: Badge[];
  bio?: string;
  location?: string;
}

export interface UselessSkill {
  id: string;
  name: string;
  description: string;
  endorsements: number;
  dateAdded: Date;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  isCurrentRole: boolean;
}

export interface Endorsement {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserImage: string;
  skillId: string;
  skillName: string;
  date: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: Date;
  rarity: 'common' | 'rare' | 'legendary';
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  uselessnessLevel: number;
  postedDate: Date;
  applications: number;
}

export interface UselessTip {
  id: string;
  title: string;
  content: string;
  category: string;
  date: Date;
}