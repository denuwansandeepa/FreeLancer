"use client";

import { useState, useEffect } from "react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: (updatedUser: any) => void;
}

const avatarPresets = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
];

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  
  // Freelancer specific states
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [skills, setSkills] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [experience, setExperience] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setImage(user.image || "");
      
      const fp = user.freelancerProfile;
      if (fp) {
        setTitle(fp.title || "");
        setBio(fp.bio || "");
        setCategory(fp.category || "Web Development");
        setSkills(fp.skills || "");
        setStartingPrice(fp.startingPrice || "");
        setExperience(fp.experience || "");
      }
    }

    const fetchFreshProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (response.ok && data.success && data.user) {
          const u = data.user;
          setName(u.name || "");
          setPhone(u.phone || "");
          setLocation(u.location || "");
          setImage(u.image || "");
          
          const fp = u.freelancerProfile;
          if (fp) {
            setTitle(fp.title || "");
            setBio(fp.bio || "");
            setCategory(fp.category || "Web Development");
            setSkills(fp.skills || "");
            setStartingPrice(fp.startingPrice || "");
            setExperience(fp.experience || "");
          }
        }
      } catch (err) {
        console.error("Failed to fetch fresh profile data:", err);
      }
    };

    fetchFreshProfile();
  }, [user, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("⚠️ Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    onClose();
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg("Name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        phone,
        location,
        image,
        ...(user?.role === "FREELANCER" && {
          title,
          bio,
          category,
          skills,
          startingPrice,
          experience,
        }),
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg("🎉 Profile updated successfully!");
        
        // Update user state in localStorage
        const savedUser = localStorage.getItem("skillLankaUser");
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const newUserObj = { ...parsed, ...data.user };
          localStorage.setItem("skillLankaUser", JSON.stringify(newUserObj));
          window.dispatchEvent(new Event("skillLankaUserUpdated"));
          onSuccess(newUserObj);
        } else {
          localStorage.setItem("skillLankaUser", JSON.stringify(data.user));
          window.dispatchEvent(new Event("skillLankaUserUpdated"));
          onSuccess(data.user);
        }

        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setErrorMsg(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-sm p-4 md:p-10 animate-fade-in"
      onClick={handleClose}
    >
      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-xl md:max-w-2xl transform rounded-3xl bg-white p-8 text-left shadow-2xl transition-all duration-300 border border-gray-100 my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-gray-900">Edit Profile</h3>
          <p className="mt-1 text-sm text-gray-500">Update your account detail information.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">
            ⚠️ {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-600 border border-emerald-100">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Selection */}
          <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="relative group">
              {image ? (
                <img
                  src={image}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl group-hover:opacity-95 transition-opacity"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-black uppercase border-4 border-white shadow-xl">
                  {name ? name[0] : "?"}
                </div>
              )}

              {/* Upload Overlay Icon Button */}
              <label
                htmlFor="avatar-file-input"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg cursor-pointer transition-all hover:scale-110 flex items-center justify-center border border-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="avatar-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="w-full text-center">
              <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Choose a Premium Avatar
              </span>
              <div className="flex justify-center gap-2 mb-3">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer hover:scale-110 ${
                      image === preset ? "border-blue-600 scale-105" : "border-transparent"
                    }`}
                  >
                    <img src={preset} alt={`Avatar Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Or paste custom image URL..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full text-center text-xs rounded-xl border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g., +94 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g., Colombo, Sri Lanka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {user?.role === "FREELANCER" && (
            <div className="space-y-4 pt-4 border-t border-gray-150">
              <span className="block text-xs font-black uppercase tracking-wider text-blue-600 mb-2">
                Freelancer Profile Settings
              </span>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Professional Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Full Stack Developer, Graphic Designer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Writing">Writing</option>
                    <option value="App Development">App Development</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Starting Price *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rs. 5,000, Negotiable"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Bio / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell clients about your services and experience..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, CSS"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3+ Years, Expert"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
