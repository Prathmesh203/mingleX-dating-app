"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../services/profileService";
import { Camera, Edit2, Save, X } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "../components/Avatar";
import { Button } from "../components/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { useAuth } from "../context/authContext";
import { Loader } from 'lucide-react';
export function ProfilePage() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(token),
  });

  const profileData = data?.success ? data.data.data : null; // API shape: {success, data: axiosResponse}

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  // 🔹 Update profile mutation
  const mutation = useMutation({
    mutationFn: (updatedData) => updateProfile(token, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setEditedProfile(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    // build FormData for text + image
    const formData = new FormData();
    Object.entries(editedProfile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    mutation.mutate(formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedProfile({ ...editedProfile, profile: file }); // send as file, backend will convert
    }
  };

  if (isLoading) return( <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 text-pink-500 animate-spin" />
      </div>);
  if (!profileData) return <p>Profile not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={mutation.isLoading}
              className="gap-2 bg-green-500 hover:bg-green-600"
            >
              <Save className="h-4 w-4" />
              {mutation.isLoading ? "Saving..." : "Save"}
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Image */}
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={
                  isEditing
                    ? (editedProfile?.profile instanceof File
                        ? URL.createObjectURL(editedProfile.profile)
                        : editedProfile?.profile) || profileData.profile
                    : profileData.profile
                }
              />
              <AvatarFallback>
                {profileData.firstname[0]}
                {profileData.lastname[0]}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Name</label>
              {isEditing ? (
                <Input
                  value={editedProfile?.firstname || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      firstname: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">
                  {profileData.firstname} {profileData.lastname}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label>Age</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedProfile?.age || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      age: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profileData.age}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label>Location</label>
            {isEditing ? (
              <Input
                value={editedProfile?.location || ""}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    location: e.target.value,
                  })
                }
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profileData.location}</p>
            )}
          </div>
          <div className="space-y-2">
            <label>Occupation</label>
            {isEditing ? (
              <Input
                value={editedProfile?.occupation || ""}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    occupation: e.target.value,
                  })
                }
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">
                {profileData.occupation}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={editedProfile?.bio || ""}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, bio: e.target.value })
              }
              rows={4}
            />
          ) : (
            <p className="p-2 bg-gray-50 rounded">{profileData.bio}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
