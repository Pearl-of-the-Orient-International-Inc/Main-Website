"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

/**
 * Ensures the signed-in Clerk user exists in the Convex `users` table.
 * If the `clerkId` is not found, it will create a new user document.
 */
export function UserSync() {
  const { user, isLoaded } = useUser();

  // Load all users; simple but fine for small scale.
  const users = useQuery(api.backend.user.get);
  const createUser = useMutation(api.backend.user.create);

  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !users || hasSynced) return;

    const exists = users.some((u) => u.clerkId === user.id);
    if (exists) {
      return;
    }

    // Create the user in Convex if not present.
    void createUser({
      clerkId: user.id,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      emailAddress:
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        "",
      imageUrl: user.imageUrl,
    }).finally(() => {
      setHasSynced(true);
    });
  }, [isLoaded, user, users, hasSynced, createUser]);

  // This component doesn't render anything visible.
  return null;
}

