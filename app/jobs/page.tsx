"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { JobListing } from '@/lib/types';
import { Briefcase, MapPin, Calendar, Building, Search, Send, Clock } from 'lucide-react';

const SAMPLE_JOBS: JobListing[] = [
  {
    id: '1',
    title: 'Chief Procrastination Officer',
    company: 'DoNothing Corp',
    location: 'Remote (Preferably from bed)',
    description: 'Lead our team in strategic delay tactics and advanced deadline avoidance. Perfect for someone who excels at turning simple tasks into complex philosophical journeys.',
    requirements: [
      'Masters degree in Professional Procrastination',
      '5+ years experience in strategic time wasting',
      'Certified in Advanced Excuse Generation',
      'Fluent in the art of looking busy while doing nothing'
    ],
    uselessnessLevel: 98,
    postedDate: new Date('2024-01-10'),
    applications: 247,
  },
  {
    id: '2',
    title: 'Senior Meeting Facilitator (No Outcomes Required)',
    company: 'Circular Discussions Ltd',
    location: 'Conference Rooms Worldwide',
    description: 'Orchestrate endless meetings that accomplish absolutely nothing. We\'re looking for someone who can turn a 5-minute discussion into a 3-hour philosophical debate.',
    requirements: [
      'PhD in Circular Logic',
      'Expert level in talking without saying anything',
      'Advanced skills in agenda derailment',
      'Minimum 100 hours of pointless meeting experience'
    ],
    uselessnessLevel: 95,
    postedDate: new Date('2024-01-08'),
    applications: 189,
  },
  {
    id: '3',
    title: 'Professional Email Composer',
    company: 'Verbose Communications Inc',
    location: 'Anywhere with WiFi',
    description: 'Transform simple "yes" or "no" responses into elaborate 500-word essays. We need someone who can schedule meetings to discuss scheduling other meetings.',
    requirements: [
      'Bachelors in Unnecessary Communication',
      'Expert in CC: Everyone methodology',
      'Advanced Reply All certification',
      'Proven track record of email thread explosions'
    ],
    uselessnessLevel: 89,
    postedDate: new Date('2024-01-05'),
    applications: 312,
  },
  {
    id: '4',
    title: 'Director of Strategic Overthinking',
    company: 'Analysis Paralysis Partners',
    location: 'Mental Mazes Office Complex',
    description: 'Lead our overthinking initiatives and ensure every simple decision requires extensive analysis. Perfect for someone who can find 47 reasons why we shouldn\'t do something.',
    requirements: [
      'Masters in Decision Paralysis',
      '10+ years in strategic confusion',
      'Certified Overthinker (Level 9)',
      'Expertise in worst-case scenario modeling'
    ],
    uselessnessLevel: 92,
    postedDate: new Date('2024-01-03'),
    applications: 156,
  },
  {
    id: '5',
    title: 'Coffee Break Coordinator',
    company: 'Perpetual Pause Productions',
    location: 'Kitchen areas globally',
    description: 'Manage and extend coffee breaks to their maximum potential. We\'re seeking someone who can turn a 15-minute break into a 2-hour social gathering.',
    requirements: [
      'Degree in Break Time Optimization',
      'Advanced Procaffeination techniques',
      'Social gathering facilitation skills',
      'Expertise in avoiding actual work topics'
    ],
    uselessnessLevel: 87,
    postedDate: new Date('2024-01-01'),
    applications: 423,
  },
];

const AUTO_REPLIES = [
  "Thank you for your application! We're impressed by your commitment to uselessness. Our hiring process involves 47 rounds of interviews, each one more pointless than the last.",
  "We've received your application and will get back to you... eventually. Maybe. Our review process is designed to be as unproductive as possible.",
  "Congratulations! You've successfully applied to a job that doesn't actually exist. This demonstrates the exact level of uselessness we're looking for.",
  "Your application has been filed in our comprehensive system of organized chaos. We'll contact you when we figure out what this position actually does.",
  "Thank you for applying! We're currently in a meeting to schedule a meeting about reviewing applications. This could take several decades."
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const filteredJobs = SAMPLE_JOBS.filter(
    job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (job: JobListing) => {
    const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    toast.success('Application Submitted!', {
      description: randomReply,
      duration: 8000,
    });
    setSelectedJob(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Useless Job Opportunities</h1>
        <p className="text-gray-600">
          Find your next meaningless career move in professional unproductivity
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for useless positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {SAMPLE_JOBS.length}
            </div>
            <div className="text-sm text-gray-600">Useless Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {SAMPLE_JOBS.reduce((sum, job) => sum + job.applications, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(SAMPLE_JOBS.reduce((sum, job) => sum + job.uselessnessLevel, 0) / SAMPLE_JOBS.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Uselessness</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {Math.max(...SAMPLE_JOBS.map(job => job.uselessnessLevel))}%
            </div>
            <div className="text-sm text-gray-600">Max Uselessness</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <div className="flex items-center space-x-4 text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Building className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(job.postedDate)}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{job.applications} applications</span>
                    <Badge variant="outline">
                      {job.uselessnessLevel}% Useless
                    </Badge>
                  </div>
                </div>
                <div className="ml-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedJob(job)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5" />
                          <span>{job.title}</span>
                        </DialogTitle>
                        <DialogDescription>
                          {job.company} • {job.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Job Description</h4>
                          <p className="text-gray-700">{job.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Requirements</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-semibold text-gray-900">Uselessness Level</div>
                            <div className="text-2xl font-bold text-blue-600">{job.uselessnessLevel}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">{job.applications} applications</div>
                            <div className="text-sm text-gray-500">Posted {formatDate(job.postedDate)}</div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleApply(job)}
                          className="w-full"
                          size="lg"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now (Uselessly)
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search terms to find more useless opportunities.</p>
          </CardContent>
        </Card>
      )}

      {/* Career Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Career Advancement Tips</span>
          </CardTitle>
          <CardDescription>Expert advice for maximizing your professional uselessness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Interview Preparation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Practice looking thoughtful while saying nothing meaningful</li>
                <li>• Master the art of answering questions with more questions</li>
                <li>• Prepare anecdotes that somehow relate to everything and nothing</li>
                <li>• Perfect your "I'll circle back on that" technique</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Networking Strategy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connect with other professional procrastinators</li>
                <li>• Join groups dedicated to strategic time-wasting</li>
                <li>• Attend networking events and talk about the weather</li>
                <li>• Master the elevator pitch that goes nowhere</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}