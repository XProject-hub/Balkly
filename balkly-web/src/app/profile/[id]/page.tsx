"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Mail, 
  Calendar, 
  Shield, 
  Star, 
  MessageSquare, 
  FileText, 
  Award,
  CheckCircle,
  User as UserIcon
} from "lucide-react";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  profile?: {
    bio?: string;
    location?: string;
    phone?: string;
    avatar_url?: string;
  };
}

interface Reputation {
  points: number;
  level: string;
  stats: {
    posts: number;
    topics: number;
    solutions: number;
    helpful: number;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/users/${userId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to load profile");
        }
        return;
      }
      
      const data = await response.json();
      setUser(data.user);
      setReputation(data.reputation);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'expert': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'intermediate': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-48 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button variant="outline" asChild className="mb-6">
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          
          <Card className="border-destructive">
            <CardContent className="p-8 text-center">
              <UserIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
              <p className="text-muted-foreground">{error || "The user you're looking for doesn't exist."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="secondary" size="sm" asChild className="mb-4">
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold flex-shrink-0">
                {user.profile?.avatar_url ? (
                  <img 
                    src={user.profile.avatar_url} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.name[0].toUpperCase()
                )}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium uppercase">
                    {user.role}
                  </span>
                  {user.email_verified_at && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDate(user.created_at)}</span>
                  </div>
                  {user.profile?.location && (
                    <div className="flex items-center gap-2">
                      <span>📍 {user.profile.location}</span>
                    </div>
                  )}
                </div>

                {user.profile?.bio && (
                  <p className="mt-4 text-sm">{user.profile.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reputation Card */}
        {reputation && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Reputation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-bold text-primary">{reputation.points}</div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(reputation.level)}`}>
                    {reputation.level}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">Reputation Points</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{reputation.stats.posts}</div>
                  <div className="text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{reputation.stats.topics}</div>
                  <div className="text-sm text-muted-foreground">Topics</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{reputation.stats.solutions}</div>
                  <div className="text-sm text-muted-foreground">Solutions</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold">{reputation.stats.helpful}</div>
                  <div className="text-sm text-muted-foreground">Helpful</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href={`/listings?seller=${user.id}`}>
                  View Listings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/forum?author=${user.id}`}>
                  View Forum Posts
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/users">
                  Back to User Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
