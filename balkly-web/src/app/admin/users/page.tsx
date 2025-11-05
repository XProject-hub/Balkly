"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, UserX, Shield, Mail } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    loadUsers();
  }, [roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append("role", roleFilter);
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(`/api/v1/admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number, userName: string) => {
    if (!confirm(`Are you sure you want to ban ${userName}?`)) return;

    try {
      await fetch(`/api/v1/admin/users/${userId}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      alert("User banned successfully");
      loadUsers();
    } catch (error) {
      alert("Failed to ban user");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin">
            <Button variant="secondary" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">User Management</h1>
          <p className="text-lg opacity-90">Manage platform users</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Roles</option>
                <option value="user">Users</option>
                <option value="seller">Sellers</option>
                <option value="organizer">Organizers</option>
                <option value="moderator">Moderators</option>
                <option value="admin">Admins</option>
              </select>
              <Button onClick={loadUsers}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {user.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium uppercase">
                            {user.role}
                          </span>
                          {user.email_verified_at && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {user.twofa_secret && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              2FA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/profile/${user.id}`}>View Profile</Link>
                      </Button>
                      {user.role !== "admin" && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleBanUser(user.id, user.name)}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Ban
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={async () => {
                              if (!confirm(`Permanently delete ${user.name}? This cannot be undone!`)) return;
                              
                              try {
                                const response = await fetch(`/api/v1/admin/users/${user.id}`, {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
                                  },
                                });
                                
                                if (response.ok) {
                                  // Remove from list immediately
                                  setUsers(users.filter(u => u.id !== user.id));
                                  alert("User deleted successfully");
                                } else {
                                  alert("Failed to delete user");
                                }
                              } catch (error) {
                                alert("Failed to delete user");
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

