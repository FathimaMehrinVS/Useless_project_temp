import { User } from './types';
import { differenceInWeeks, differenceInMonths } from 'date-fns';

export function calculateUselessnessScore(user: User): number {
  // Base score: Random (60-100%)
  let score = Math.floor(Math.random() * 41) + 60;
  
  // +2% per useless skill
  score += user.skills.length * 2;
  
  // +1% per 10 endorsements (max +20%)
  const totalEndorsements = user.endorsements.length;
  const endorsementBonus = Math.min(Math.floor(totalEndorsements / 10), 20);
  score += endorsementBonus;
  
  // +0.5% per week active
  const weeksActive = differenceInWeeks(new Date(), user.joinDate);
  score += weeksActive * 0.5;
  
  // -1% per month inactive (minimum 50%)
  const monthsInactive = differenceInMonths(new Date(), user.lastActive);
  score -= monthsInactive;
  
  // Ensure minimum of 50% and maximum of 100%
  return Math.max(50, Math.min(100, Math.round(score)));
}

export const USELESS_SKILLS_SUGGESTIONS = [
  "Professional Procrastination",
  "Advanced Paper Airplane Engineering",
  "Competitive Napping",
  "Overthinking Simple Tasks",
  "Creative Excuse Generation",
  "Expert Level Distraction",
  "Mastery of Unproductive Meetings",
  "Professional Time Wasting",
  "Advanced Daydreaming",
  "Competitive Complaining",
  "Expert Level Postponement",
  "Creative Avoidance Strategies",
  "Professional Social Media Scrolling",
  "Advanced Coffee Break Extension",
  "Mastery of Looking Busy",
];

export const BADGES = {
  NEWCOMER: { name: "Blissfully Unproductive", icon: "🌱", description: "Welcome to uselessness!" },
  SKILL_COLLECTOR: { name: "Skill Hoarder", icon: "📚", description: "Added 10+ useless skills" },
  ENDORSED: { name: "Professionally Useless", icon: "👍", description: "Received 50+ endorsements" },
  POPULAR: { name: "Uselessly Famous", icon: "⭐", description: "Profile viewed 1000+ times" },
  LEADER: { name: "Chief Uselessness Officer", icon: "👑", description: "Top 10 on leaderboard" },
  VETERAN: { name: "Veteran Slacker", icon: "🏆", description: "1 year of uselessness" },
};