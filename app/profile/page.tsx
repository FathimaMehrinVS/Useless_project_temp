"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { UselessSkill, WorkExperience } from '@/lib/types';
import { USELESS_SKILLS_SUGGESTIONS } from '@/lib/uselessness-calculator';
import { toast } from 'sonner';
import { Edit, Plus, Eye, Calendar, MapPin, Award, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
  });
  const [newSkill, setNewSkill] = useState({ name: '', description: '' });
  const [newWork, setNewWork] = useState({
    title: '',
    company: '',
    duration: '',
    description: '',
    isCurrentRole: false,
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name,
        bio: user.bio || '',
        location: user.location || '',
      });
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name || !newSkill.description) {
      toast.error('Please fill in all fields');
      return;
    }

    const skill: UselessSkill = {
      id: Date.now().toString(),
      name: newSkill.name,
      description: newSkill.description,
      endorsements: 0,
      dateAdded: new Date(),
    };

    try {
      await updateUser({
        skills: [...user.skills, skill],
      });
      setNewSkill({ name: '', description: '' });
      toast.success('Useless skill added!');
    } catch (error) {
      toast.error('Failed to add skill');
    }
  };

  const handleAddWorkExperience = async () => {
    if (!newWork.title || !newWork.company) {
      toast.error('Please fill in required fields');
      return;
    }

    const work: WorkExperience = {
      id: Date.now().toString(),
      ...newWork,
    };

    try {
      await updateUser({
        workExperience: [...user.workExperience, work],
      });
      setNewWork({
        title: '',
        company: '',
        duration: '',
        description: '',
        isCurrentRole: false,
      });
      toast.success('Work experience added!');
    } catch (error) {
      toast.error('Failed to add work experience');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {user.uselessnessScore}% Useless
                  </Badge>
                </div>
                
                {user.bio && (
                  <p className="text-gray-600 mb-3">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(user.joinDate, 'MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{user.profileViews} profile views</span>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Useless Skills */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Useless Skills</CardTitle>
                <CardDescription>Your most unproductive talents</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Useless Skill</DialogTitle>
                    <DialogDescription>
                      Share another unproductive talent with the world
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Skill name (e.g., Professional Procrastination)"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                      />
                      <div className="mt-2 text-sm text-gray-500">
                        Suggestions: {USELESS_SKILLS_SUGGESTIONS.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                    <Textarea
                      placeholder="Describe your useless skill..."
                      value={newSkill.description}
                      onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    />
                    <Button onClick={handleAddSkill} className="w-full">
                      Add Skill
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {user.skills.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No useless skills yet. Add some to increase your uselessness score!
              </p>
            ) : (
              <div className="grid gap-4">
                {user.skills.map((skill) => (
                  <div key={skill.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                      <Badge variant="secondary">
                        {skill.endorsements} endorsements
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{skill.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Unproductive Experience</CardTitle>
                <CardDescription>Your professional journey in uselessness</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                    <DialogDescription>
                      Document your unproductive professional journey
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Job title (e.g., Chief Procrastination Officer)"
                      value={newWork.title}
                      onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                    />
                    <Input
                      placeholder="Company name"
                      value={newWork.company}
                      onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
                    />
                    <Input
                      placeholder="Duration (e.g., 2020 - Present)"
                      value={newWork.duration}
                      onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })}
                    />
                    <Textarea
                      placeholder="Describe your unproductive achievements..."
                      value={newWork.description}
                      onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                    />
                    <Button onClick={handleAddWorkExperience} className="w-full">
                      Add Experience
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {user.workExperience.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No work experience added yet. Share your unproductive career highlights!
              </p>
            ) : (
              <div className="space-y-4">
                {user.workExperience.map((work) => (
                  <div key={work.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{work.title}</h3>
                        <p className="text-gray-600">{work.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{work.duration}</p>
                        {work.description && (
                          <p className="text-sm text-gray-700">{work.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievement Badges</span>
            </CardTitle>
            <CardDescription>Recognition for your useless accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            {user.badges.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No badges earned yet. Keep being useless to unlock achievements!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.badges.map((badge) => (
                  <div key={badge.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <h4 className="font-semibold">{badge.name}</h4>
                      <p className="text-sm text-gray-500">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your professional uselessness information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Full name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
            <Input
              placeholder="Location"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            />
            <Textarea
              placeholder="Bio - tell the world about your useless expertise..."
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveProfile} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}