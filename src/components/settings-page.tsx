"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useFetchProfile } from "@/src/hooks/useFetchProfile";
import type { RootState } from "@/src/redux/store";
import type { User } from "@/src/types/user";
import { toast } from "react-toastify";
import { BiPencil } from "react-icons/bi";
import { FiLink, FiSun, FiMoon } from "react-icons/fi";
import Input from "./input";
import Spinner from "./spinner";
import { useTheme } from "../context/ThemeContext";

interface ModalProps {
  user: User;
  setModal: (open: boolean) => void;
}

const EditProfileModal = ({ user, setModal }: ModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: user.name ?? "",
    website: user.website ?? "https://",
    bio: user.bio ?? "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("website", form.website);
    formData.append("bio", form.bio);
    if (selectedFile) formData.append("picture", selectedFile);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/profile`,
        {
          method: "PATCH",
          headers: { "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY! },
          body: formData,
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        toast.error(response.message || "Failed to update profile");
        return;
      }
      toast.success(response.message || "Profile updated!");
      setModal(false);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black/80 fixed inset-0 z-50 flex-center backdrop-blur-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-stone-800 p-6 border border-stone-100 dark:border-stone-700 rounded-xl w-full max-w-md mx-auto shadow-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex-end mb-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => setModal(false)}
            className="py-1 px-3 bg-red-600 text-white text-sm font-outfit rounded-md border border-red-600 hover:bg-transparent hover:text-red-600 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        <div className="flex-start gap-4 mb-6">
          <div className="h-20 w-20 rounded-full flex-center overflow-hidden bg-stone-100 border border-stone-200">
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : user.picture ? (
              <img src={user.picture} alt="current" className="w-full h-full object-cover" />
            ) : (
              <span className="text-stone-400 text-3xl font-light">+</span>
            )}
          </div>
          <div>
            <label
              htmlFor="file-upload"
              className="text-blue-500 font-outfit cursor-pointer hover:text-blue-700 text-sm transition"
            >
              Change Photo
            </label>
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4 font-open text-sm">
          <div>
            <p className="mb-1 text-stone-600 dark:text-stone-300 font-medium">Name</p>
            <Input type="text" name="name" value={form.name} onChange={handleFormChange} />
          </div>
          <div>
            <p className="mb-1 text-stone-600 dark:text-stone-300 font-medium">Link</p>
            <Input type="url" name="website" placeholder="https://" value={form.website} onChange={handleFormChange} />
          </div>
          <div>
            <p className="mb-1 text-stone-600 dark:text-stone-300 font-medium">Bio</p>
            <textarea
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleFormChange}
              className="border-b border-b-accentLight bg-transparent focus:outline-none w-full py-1 placeholder:text-accentLight dark:text-stone-400 resize-none font-sans"
            />
          </div>
        </div>

        {loading ? (
          <button
            type="button"
            className="bg-stone-300 w-full py-2.5 flex-center text-white mt-6 rounded-md cursor-not-allowed"
          >
            <Spinner size={18} color="white" />
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary w-full mt-6 py-2.5 rounded-md text-sm font-medium"
          >
            Update Profile
          </button>
        )}
      </form>
    </section>
  );
};

const SettingsPage = () => {
  useFetchProfile();
  const [modal, setModal] = useState(false);
  const {  darkMode, toggleTheme } = useTheme();

  const user: User = useSelector(
    (state: RootState) => state.user.profile as User
  );

  const copyProfileLink = async () => {
    try {
      const url = `${window.location.origin}/${user.username}`;
      await navigator.clipboard.writeText(url);
      toast.success("Profile URL copied to clipboard.");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <main className="w-[90%] sm:w-112.5 mx-auto pt-5 pb-20">
      {modal && <EditProfileModal user={user} setModal={setModal} />}

      <div className="flex-between mt-12">
        <h1 className="font-inter font-bold text-3xl dark:text-gray-200">Settings</h1>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition duration-200"
          aria-label="Toggle Theme"
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div className="my-6">
        <p className="font-inter text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Account
        </p>
        <hr className="border-stone-100 dark:border-stone-800" />
      </div>

      <div className="text-accent text-sm font-open space-y-5">
        <div className="flex-between py-1 border-b border-stone-50 dark:border-stone-800">
          <p className="text-stone-400">Name</p>
          <p className="font-medium text-stone-500">{user.name || "—"}</p>
        </div>

        <div className="flex-between py-1 border-b border-stone-50 dark:border-stone-800">
          <p className="text-stone-400">Email</p>
          <p className="font-medium text-stone-500">{user.email || "—"}</p>
        </div>

        <div className="flex-between py-1 border-b border-stone-50 dark:border-stone-800">
          <p className="text-stone-400">Link</p>
          {user.website ? (
            <a
              href={user.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline truncate max-w-60"
            >
              {user.website}
            </a>
          ) : (
            <p className="text-stone-400">—</p>
          )}
        </div>

        <div className="py-1">
          <p className="text-stone-400 mb-2">Bio</p>
          <p className="font-dm text-stone-700 bg-stone-50/60 p-3 rounded-lg border border-stone-100 dark:border-stone-400 min-h-12 leading-relaxed">
            {user.bio || "No bio written yet."}
          </p>
        </div>

        {user.interests && user.interests.length > 0 && (
          <div className="py-1">
            <p className="text-stone-400 mb-2">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="bg-stone-100 text-stone-600 px-2.5 py-1 rounded text-xs font-inter font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex-start gap-3">
        <button
          onClick={() => setModal(true)}
          className="btn-primary flex-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
        >
          <span>Edit</span>
          <BiPencil size={14} />
        </button>

        <button
          onClick={copyProfileLink}
          className="bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 active:bg-stone-100 flex-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition cursor-pointer"
        >
          <span>Share Profile</span>
          <FiLink size={14} />
        </button>
      </div>
    </main>
  );
};

export default SettingsPage;