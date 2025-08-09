"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { User, Endorsement } from '@/lib/types';
import { toast } from 'sonner';
import { Users, Search, ThumbsUp, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function NetworkPage() {
  const { user: currentUser, updateUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [endorsingSkills, setEndorsingSkills] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    if (!currentUser) return;
    
    try {
      const q = query(
        collection(db, 'users'),
        where('id', '!=', currentUser.id),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const endorseSkill = async (targetUser: User, skillId: string) => {
    if (!currentUser) return;

    const endorsementKey = `${targetUser.id}-${skillId}`;
    if (endorsingSkills[endorsementKey]) return;

    setEndorsingSkills(prev => ({ ...prev, [endorsementKey]: true }));

    try {
      // Create endorsement object
      const endorsement: Endorsement = {
        id: Date.now().toString(),
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserImage: currentUser.profileImage,
        skillId: skillId,
        skillName: targetUser.skills.find(s => s.id === skillId)?.name || '',
        date: new Date(),
      };

      // Update target user's endorsements
      await updateDoc(doc(db, 'users', targetUser.id), {
        endorsements: arrayUnion(endorsement),
      });

      // Update target user's skill endorsement count
      const updatedSkills = targetUser.skills.map(skill =>
        skill.id === skillId ? { ...skill, endorsements: skill.endorsements + 1 } : skill
      );
      
      await updateDoc(doc(db, 'users', targetUser.id), {
        skills: updatedSkills,
      });

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === targetUser.id
            ? {
                ...user,
                endorsements: [...user.endorsements, endorsement],
                skills: updatedSkills,
              }
            : user
        )
      );

      toast.success(`Endorsed ${targetUser.name} for their useless skill!`);
    } catch (error) {
      toast.error('Failed to endorse skill');
      console.error('Error endorsing skill:', error);
    } finally {
      setEndorsingSkills(prev => ({ ...prev, [endorsementKey]: false }));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Network</h1>
        <p className="text-gray-600">
          Connect with fellow unproductive professionals and endorse their useless skills
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{users.length}</div>
            <div className="text-sm text-gray-600">Network Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {users.reduce((sum, user) => sum + user.skills.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Useless Skills</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {users.reduce((sum, user) => sum + user.endorsements.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Endorsements Given</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {Math.round(users.reduce((sum, user) => sum + user.uselessnessScore, 0) / users.length) || 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Uselessness</div>
          </CardContent>
        </Card>
      </div>

      {/* User Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{user.uselessnessScore}% Useless</Badge>
                    <Badge variant="secondary">{user.skills.length} skills</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {format(user.joinDate, 'MMM yyyy')}</span>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{user.bio}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              {user.skills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Useless Skills</h4>
                  <div className="space-y-2">
                    {user.skills.slice(0, 3).map((skill) => {
                      const endorsementKey = `${user.id}-${skill.id}`;
                      const isEndorsing = endorsingSkills[endorsementKey];
                      const hasEndorsed = user.endorsements.some(
                        e => e.fromUserId === currentUser?.id && e.skillId === skill.id
                      );

                      return (
                        <div key={skill.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate block">
                              {skill.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {skill.endorsements} endorsements
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant={hasEndorsed ? "secondary" : "outline"}
                            disabled={isEndorsing || hasEndorsed}
                            onClick={() => endorseSkill(user, skill.id)}
                          >
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {hasEndorsed ? 'Endorsed' : isEndorsing ? 'Endorsing...' : 'Endorse'}
                          </Button>
                        </div>
                      );
                    })}
                    {user.skills.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{user.skills.length - 3} more skills
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Endorsements */}
              {user.endorsements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recent Endorsements</h4>
                  <div className="space-y-1">
                    {user.endorsements.slice(-2).reverse().map((endorsement) => (
                      <div key={endorsement.id} className="text-xs text-gray-600">
                        <strong>{endorsement.fromUserName}</strong> endorsed{' '}
                        <em>{endorsement.skillName}</em>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search terms or check back later for new members.</p>
          </CardContent>
        </Card>
      )}

      {users.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to the network!</h3>
            <p className="text-gray-600">You're among the first members. Invite others to join the uselessness revolution!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}