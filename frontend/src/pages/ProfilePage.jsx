"use client";

import { useState } from 'react';
import { Camera, Edit2, Save, X } from 'lucide-react';

import {Avatar , AvatarImage, AvatarFallback} from '../components/Avatar';
import { Button } from '../components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';


const initialProfile = {
  name: "John Doe",
  age: "28",
  location: "New York, NY",
  occupation: "Software Developer",
  bio: "Passionate about technology, love hiking, and always up for a good coffee. Looking for someone to share adventures with!",
  interests: ["Technology", "Hiking", "Coffee", "Travel", "Photography"],
  profileImage: "https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsfGVufDF8fHx8MTc1NzU3MjY0OXww&ixlib=rb-4.1.0&q=80&w=1080"
};

export function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialProfile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        setEditedProfile({ ...editedProfile, profileImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterestAdd = (interest) => {
    if (interest && !editedProfile.interests.includes(interest)) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, interest]
      });
    }
  };

  const handleInterestRemove = (interest) => {
    setEditedProfile({
      ...editedProfile,
      interests: editedProfile.interests.filter(i => i !== interest)
    });
  };

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
            <Button onClick={handleSave} className="gap-2 bg-green-500 hover:bg-green-600">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={isEditing ? editedProfile.profileImage : profile.profileImage} />
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
              {isEditing ? (
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Age</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={editedProfile.age}
                  onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{profile.age}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location</label>
            {isEditing ? (
              <Input
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profile.location}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Occupation</label>
            {isEditing ? (
              <Input
                value={editedProfile.occupation}
                onChange={(e) => setEditedProfile({ ...editedProfile, occupation: e.target.value })}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profile.occupation}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label>
            {isEditing ? (
              <Textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                rows={4}
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{profile.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(isEditing ? editedProfile.interests : profile.interests).map((interest, index) => (
              <span
                key={index}
                className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {interest}
                {isEditing && (
                  <button
                    onClick={() => handleInterestRemove(interest)}
                    className="text-pink-600 hover:text-pink-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <Input
                placeholder="Add interest..."
                className="w-32"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleInterestAdd(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
