"use client";

import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import { Trophy, Users, Briefcase, TrendingUp, Star, Coffee, AlertTriangle } from 'lucide-react';

const dailyTips = [
  "Master the art of looking busy while doing absolutely nothing productive.",
  "Perfect your 'thinking face' for those moments when you're actually daydreaming.",
  "Practice strategic bathroom breaks to avoid actual work assignments.",
  "Develop your ability to turn 5-minute tasks into all-day projects.",
  "Learn to nod thoughtfully during meetings while mentally planning your lunch.",
];

const featuredJobs = [
  {
    title: "Chief Procrastination Officer",
    company: "DoNothing Corp",
    location: "Remote (Preferably from bed)",
    uselessnessLevel: 98,
  },
  {
    title: "Professional Meeting Attender",
    company: "Endless Discussions Ltd",
    location: "Conference Rooms Worldwide",
    uselessnessLevel: 95,
  },
  {
    title: "Senior Excuse Generator",
    company: "Creative Avoidance Inc",
    location: "Anywhere but the office",
    uselessnessLevel: 92,
  },
];

export default function HomePage() {
  const { user, loading, firebaseError, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (firebaseError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuration Error:</strong> {firebaseError}
            <br />
            <br />
            To fix this:
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
              <li>Enable Authentication with Google provider</li>
              <li>Enable Firestore Database</li>
              <li>Copy <code>.env.local.example</code> to <code>.env.local</code></li>
              <li>Fill in your Firebase configuration values</li>
              <li>Restart the development server</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">LinkedOut</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The World's First Uselessness Network™ - Where your most unproductive skills finally get the recognition they deserve.
          </p>
          <p className="text-gray-500">
            Please configure Firebase to continue.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">LinkedOut</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The World's First Uselessness Network™ - Where your most unproductive skills finally get the recognition they deserve.
          </p>
          <Button onClick={signInWithGoogle} size="lg" className="text-lg px-8 py-3">
            Join the Uselessness Revolution
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <CardTitle>Compete in Uselessness</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Climb the leaderboard by showcasing your most unproductive talents and earning endorsements for your useless skills.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Network with Fellow Slackers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Connect with like-minded professionals who understand that the best work is no work at all.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Briefcase className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Find Meaningless Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Browse exciting opportunities in professional procrastination, strategic time-wasting, and advanced nap coordination.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Join Thousands of Professional Slackers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">12,847</div>
              <div className="text-gray-600">Useless Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">89,234</div>
              <div className="text-gray-600">Useless Skills Endorsed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">1,456</div>
              <div className="text-gray-600">Meaningless Jobs Posted</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Average Uselessness Score</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Welcome back, {user.name}!</span>
                <Badge variant="outline">{user.uselessnessScore}% Useless</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your uselessness score has {Math.random() > 0.5 ? 'increased' : 'remained stable'} since your last visit. 
                Keep up the unproductive work!
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
                <Link href="/network">
                  <Button variant="outline" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Find Connections
                  </Button>
                </Link>
                <Link href="/jobs">
                  <Button variant="outline" size="sm">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Daily Tip */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                <span>Daily Useless Tip</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {dailyTips[Math.floor(Math.random() * dailyTips.length)]}
              </p>
            </CardContent>
          </Card>

          {/* Featured Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Useless Opportunities</CardTitle>
              <CardDescription>Perfect jobs for your unique skill set</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuredJobs.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <Badge variant="secondary">{job.uselessnessLevel}% Useless</Badge>
                  </div>
                  <p className="text-gray-600 mb-1">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              ))}
              <Link href="/jobs">
                <Button variant="outline" className="w-full">
                  View All Meaningless Opportunities
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Uselessness Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Views</span>
                <span className="font-semibold">{user.profileViews}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Useless Skills</span>
                <span className="font-semibold">{user.skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Endorsements</span>
                <span className="font-semibold">{user.endorsements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Badges Earned</span>
                <span className="font-semibold">{user.badges.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>Top Slackers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">Loading leaderboard...</span>
                </div>
              </div>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Full Leaderboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}