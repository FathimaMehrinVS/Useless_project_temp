"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { User } from '@/lib/types';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        orderBy('uselessnessScore', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setTopUsers(users);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-300" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'border-l-yellow-500 bg-yellow-50';
      case 2:
        return 'border-l-gray-400 bg-gray-50';
      case 3:
        return 'border-l-amber-600 bg-amber-50';
      default:
        return 'border-l-gray-200';
    }
  };

  const getUserRank = () => {
    if (!currentUser) return null;
    const rank = topUsers.findIndex(user => user.id === currentUser.id) + 1;
    return rank === 0 ? null : rank;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Uselessness Leaderboard</h1>
        <p className="text-gray-600">
          The most professionally unproductive individuals in our network
        </p>
        {currentUser && getUserRank() && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              🎉 You're currently ranked #{getUserRank()} with a {currentUser.uselessnessScore}% uselessness score!
            </p>
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {topUsers.length >= 3 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Hall of Uselessness</CardTitle>
            <CardDescription className="text-center">
              Our most celebrated unproductive professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="text-center order-1 md:order-1">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 border-4 border-gray-300">
                    <AvatarImage src={topUsers[1]?.profileImage} alt={topUsers[1]?.name} />
                    <AvatarFallback className="text-xl">{topUsers[1]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gray-400 text-white">2nd</Badge>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{topUsers[1]?.name}</h3>
                <Badge variant="outline" className="mt-2">
                  {topUsers[1]?.uselessnessScore}% Useless
                </Badge>
              </div>

              {/* 1st Place */}
              <div className="text-center order-2 md:order-2">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 border-4 border-yellow-400">
                    <AvatarImage src={topUsers[0]?.profileImage} alt={topUsers[0]?.name} />
                    <AvatarFallback className="text-2xl">{topUsers[0]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Crown className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-white">1st</Badge>
                  </div>
                </div>
                <h3 className="font-bold text-xl">{topUsers[0]?.name}</h3>
                <Badge variant="outline" className="mt-2 border-yellow-400 text-yellow-600">
                  {topUsers[0]?.uselessnessScore}% Useless
                </Badge>
              </div>

              {/* 3rd Place */}
              <div className="text-center order-3 md:order-3">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-20 h-20 border-4 border-amber-500">
                    <AvatarImage src={topUsers[2]?.profileImage} alt={topUsers[2]?.name} />
                    <AvatarFallback className="text-xl">{topUsers[2]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white">3rd</Badge>
                  </div>
                </div>
                <h3 className="font-semibold text-lg">{topUsers[2]?.name}</h3>
                <Badge variant="outline" className="mt-2">
                  {topUsers[2]?.uselessnessScore}% Useless
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Rankings</CardTitle>
          <CardDescription>All {topUsers.length} professionals ranked by uselessness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topUsers.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = currentUser?.id === user.id;
              
              return (
                <div
                  key={user.id}
                  className={`flex items-center space-x-4 p-4 border-l-4 rounded-lg transition-colors ${
                    isCurrentUser ? 'bg-blue-50 border-l-blue-500' : getRankColor(rank)
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {rank <= 3 ? getRankIcon(rank) : (
                      <span className="text-gray-500 font-semibold">#{rank}</span>
                    )}
                  </div>
                  
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.name}
                        {isCurrentUser && <span className="text-blue-600 ml-2">(You)</span>}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{user.skills.length} useless skills</span>
                      <span>{user.endorsements.length} endorsements</span>
                      {user.location && <span>{user.location}</span>}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={isCurrentUser ? "default" : "outline"}
                      className="text-lg px-3 py-1"
                    >
                      {user.uselessnessScore}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {topUsers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-600">Be the first to claim your spot on the uselessness leaderboard!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}