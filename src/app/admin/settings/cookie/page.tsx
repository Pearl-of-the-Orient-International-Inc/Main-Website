"use client";

import { Heading } from "@/components/Heading";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CookieCategoryData, CookiePreferencesState } from "@/types/cookie";
import { CookiePreferences } from "./_components/CookiePreferences";
import { CookieCategory } from "./_components/CookieCategory";
import { CookiePolicyInfo } from "./_components/CookiePolicyInfo";

const Page = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  // Initial cookie categories data
  const [cookieCategories, setCookieCategories] = useState<
    CookieCategoryData[]
  >([
    {
      id: "essential",
      title: "Essential Cookies",
      description:
        "These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and session management.",
      isRequired: true,
      isEnabled: true,
      cookieCount: 4,
      cookies: [
        {
          name: "session_token",
          purpose: "Maintains user session and authentication state",
          duration: "Session (until browser closes)",
          type: "First-party",
          provider: "Market Villamor",
        },
        {
          name: "csrf_token",
          purpose: "Prevents cross-site request forgery attacks",
          duration: "Session",
          type: "First-party",
          provider: "Market Villamor",
        },
        {
          name: "cookie_consent",
          purpose: "Stores your cookie preferences",
          duration: "1 year",
          type: "First-party",
          provider: "Market Villamor",
        },
        {
          name: "security_hash",
          purpose: "Validates secure connections and data integrity",
          duration: "Session",
          type: "First-party",
          provider: "Market Villamor",
        },
      ],
    },
    {
      id: "functional",
      title: "Functional Cookies",
      description:
        "These cookies enable enhanced functionality and personalization, such as remembering your language preference, theme settings, and user interface customizations.",
      isRequired: false,
      isEnabled: true,
      cookieCount: 3,
      cookies: [
        {
          name: "user_preferences",
          purpose: "Stores UI preferences like theme, language, and layout",
          duration: "1 year",
          type: "First-party",
          provider: "Market Villamor",
        },
        {
          name: "timezone_offset",
          purpose: "Displays times in your local timezone",
          duration: "6 months",
          type: "First-party",
          provider: "Market Villamor",
        },
        {
          name: "dashboard_config",
          purpose: "Remembers your dashboard widget arrangement",
          duration: "1 year",
          type: "First-party",
          provider: "Market Villamor",
        },
      ],
    },
    {
      id: "analytics",
      title: "Analytics Cookies",
      description:
        "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our service.",
      isRequired: false,
      isEnabled: false,
      cookieCount: 3,
      cookies: [
        {
          name: "_ga",
          purpose: "Distinguishes unique users for analytics",
          duration: "2 years",
          type: "Third-party",
          provider: "Google Analytics",
        },
        {
          name: "_gid",
          purpose: "Stores and updates a unique value for each page visited",
          duration: "24 hours",
          type: "Third-party",
          provider: "Google Analytics",
        },
        {
          name: "analytics_session",
          purpose: "Tracks session duration and user behavior patterns",
          duration: "30 minutes",
          type: "First-party",
          provider: "Market Villamor",
        },
      ],
    },
    {
      id: "marketing",
      title: "Marketing Cookies",
      description:
        "These cookies track your online activity to help advertisers deliver more relevant advertising or limit how many times you see an advertisement.",
      isRequired: false,
      isEnabled: false,
      cookieCount: 2,
      cookies: [
        {
          name: "ad_user_data",
          purpose:
            "Creates a profile of your interests for targeted advertising",
          duration: "90 days",
          type: "Third-party",
          provider: "Google Ads",
        },
        {
          name: "conversion_tracking",
          purpose: "Measures advertising campaign effectiveness",
          duration: "30 days",
          type: "Third-party",
          provider: "Google Ads",
        },
      ],
    },
  ]);

  const [initialState, setInitialState] = useState<CookiePreferencesState>({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  // Check for changes
  useEffect(() => {
    const currentState: CookiePreferencesState = {
      essential: cookieCategories[0].isEnabled,
      functional: cookieCategories[1].isEnabled,
      analytics: cookieCategories[2].isEnabled,
      marketing: cookieCategories[3].isEnabled,
    };

    const changed =
      currentState.functional !== initialState.functional ||
      currentState.analytics !== initialState.analytics ||
      currentState.marketing !== initialState.marketing;

    setHasChanges(changed);
  }, [cookieCategories, initialState]);

  const handleToggleCategory = (categoryId: string, enabled: boolean) => {
    setCookieCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, isEnabled: enabled } : cat,
      ),
    );
  };

  const handleAcceptAll = () => {
    setCookieCategories((prev) =>
      prev.map((cat) => ({ ...cat, isEnabled: true })),
    );

    toast({
      title: "Preferences Saved",
      description: "All cookies have been enabled.",
    });

    // Update initial state
    setInitialState({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleRejectAll = () => {
    setCookieCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        isEnabled: cat.isRequired ? true : false,
      })),
    );

    toast({
      title: "Preferences Saved",
      description:
        "Optional cookies have been disabled. Only essential cookies remain active.",
    });

    // Update initial state
    setInitialState({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    });
  };

  const handleSavePreferences = () => {
    // TODO: Save preferences to backend/localStorage
    const currentState: CookiePreferencesState = {
      essential: cookieCategories[0].isEnabled,
      functional: cookieCategories[1].isEnabled,
      analytics: cookieCategories[2].isEnabled,
      marketing: cookieCategories[3].isEnabled,
    };

    setInitialState(currentState);

    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated successfully.",
    });
  };

  return (
    <div>
      <Heading
        title="Cookie Settings"
        description="Manage how we use cookies to improve your experience on our platform."
      />

      <div className="space-y-6 mt-10">
        {/* Quick Actions */}
        <CookiePreferences
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onSavePreferences={handleSavePreferences}
          hasChanges={hasChanges}
        />

        {/* Cookie Categories */}
        <div className="space-y-6">
          {cookieCategories.map((category) => (
            <div key={category.id} className="space-y-2">
              <CookieCategory
                title={category.title}
                description={category.description}
                isRequired={category.isRequired}
                isEnabled={category.isEnabled}
                onToggle={(enabled) =>
                  handleToggleCategory(category.id, enabled)
                }
                cookieCount={category.cookieCount}
                cookies={category.cookies}
              />
            </div>
          ))}
        </div>

        {/* Cookie Policy Information */}
        <CookiePolicyInfo />
      </div>
    </div>
  );
};

export default Page;
