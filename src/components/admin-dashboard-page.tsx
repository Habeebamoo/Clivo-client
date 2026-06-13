"use client";

import { useFetchAdminStats } from "@/src/hooks/useFetchAdminStats";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/redux/store";
import type { User } from "@/src/types/user";
import type { Appeal } from "@/src/types/admin";
import { setUser, setAppeal } from "@/src/redux/reducers/admin";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdVerified } from "react-icons/md";
import { H2, H3 } from "./typo";
import Spinner from "./spinner";
import Alert from "./alert";

type Tab = "users" | "appeals";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { isLoading } = useFetchAdminStats();
  const users: User[] = useSelector((state: RootState) => state.admin.users);
  const appeals: Appeal[] = useSelector(
    (state: RootState) => state.admin.appeals
  );

  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState<{
    status: "success" | "error";
    text: string;
  } | null>(null);

  const showAlert = (status: "success" | "error", text: string) => {
    setAlert({ status, text });
    setTimeout(() => setAlert(null), 3000);
  };

  const banUser = async (userId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/restrict/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        showAlert("error", response.message);
        return;
      }
      showAlert("success", response.message);
    } catch {
      showAlert("error", "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const verifyUser = async (userId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/verify/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        showAlert("error", response.message);
        return;
      }
      showAlert("success", response.message);
    } catch {
      showAlert("error", "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  const resolveAppeal = async (userId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/appeal/${userId}/resolve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY!,
          },
          credentials: "include",
        }
      );
      const response = await res.json();
      if (!res.ok) {
        showAlert("error", response.message);
        return;
      }
      showAlert("success", response.message);
    } catch {
      showAlert("error", "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex-center h-screen">
        <Spinner size={24} color="accentLight" />
      </div>
    );

  return (
    <div className="mt-14 max-w-4xl mx-auto px-4 py-8">
      {alert && <Alert status={alert.status} text={alert.text} />}

      <H2 font="inter" text="Admin Dashboard" others="mb-6" />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-mutedLight border border-muted rounded-lg p-4">
          <p className="font-jsl text-sm text-accent">Total Users</p>
          <H3 font="inter" text={String(users.length)} others="mt-1" />
        </div>
        <div className="bg-mutedLight border border-muted rounded-lg p-4">
          <p className="font-jsl text-sm text-accent">Pending Appeals</p>
          <H3 font="inter" text={String(appeals.length)} others="mt-1" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-start border-b border-muted mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" ? "home-tab-active" : "home-tab"}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("appeals")}
          className={activeTab === "appeals" ? "home-tab-active" : "home-tab"}
        >
          Appeals
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {users.map((u: User) => (
            <div
              key={u.userId}
              className="border border-muted rounded-lg p-4 flex-between flex-wrap gap-3"
            >
              <div className="flex-start gap-3">
                {u.picture ? (
                  <img
                    src={u.picture}
                    alt={u.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted" />
                )}
                <div>
                  <div className="flex-start gap-1">
                    <p className="font-inter text-sm">{u.name}</p>
                    {u.verified && (
                      <MdVerified size={14} color="rgba(93, 110, 189, 1)" />
                    )}
                  </div>
                  <p className="text-xs text-accent font-outfit">
                    @{u.username}
                  </p>
                  {u.isBanned && (
                    <span className="text-xs font-inter text-red-500">
                      Banned
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-center gap-2">
                <button
                  disabled={actionLoading}
                  onClick={() => verifyUser(u.userId)}
                  className="btn-gray text-xs py-1 px-3 rounded-sm"
                >
                  {u.verified ? "Unverify" : "Verify"}
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => banUser(u.userId)}
                  className={`text-xs py-1 px-3 rounded-sm font-inter cursor-pointer ${
                    u.isBanned
                      ? "bg-green-100 hover:bg-green-200 text-green-700"
                      : "bg-red-100 hover:bg-red-200 text-red-700"
                  }`}
                >
                  {u.isBanned ? "Unban" : "Ban"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appeals Tab */}
      {activeTab === "appeals" && (
        <div className="space-y-4">
          {appeals.length === 0 ? (
            <p className="font-jsl text-accent text-center py-10">
              No pending appeals
            </p>
          ) : (
            appeals.map((appeal: Appeal) => (
              <div
                key={appeal.userId}
                className="border border-muted rounded-lg p-4"
              >
                <div className="flex-between mb-3">
                  <div className="flex-start gap-3">
                    {appeal.picture ? (
                      <img
                        src={appeal.picture}
                        alt={appeal.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted" />
                    )}
                    <div>
                      <p className="font-inter text-sm">{appeal.name}</p>
                      <p className="text-xs text-accent font-outfit">
                        @{appeal.username}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() => resolveAppeal(appeal.userId)}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    Resolve & Unban
                  </button>
                </div>
                <p className="font-open text-sm text-accent border-t border-muted pt-3">
                  {appeal.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
