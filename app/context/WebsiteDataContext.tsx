"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteMetadata } from "@/types/site.metadata";
import { Source } from "unbody/admin";

interface WebsiteDataContextType {
  siteMetadata: SiteMetadata | null;
  source: Source | null;
  loading: boolean;
  error: string | null;
}

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export const WebsiteDataProvider = ({ sourceName, children }: { sourceName: string; children: ReactNode }) => {
  const [siteMetadata, setSiteMetadata] = useState<SiteMetadata | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/get-site-metadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ source_name: sourceName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch site metadata");
        }

        const data = await response.json();
        setSiteMetadata(data.siteMetadata);
        setSource(data.source);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to fetch site metadata");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sourceName]);

  return (
    <WebsiteDataContext.Provider value={{ siteMetadata, source, loading, error }}>
      {children}
    </WebsiteDataContext.Provider>
  );
};

export const useWebsiteData = () => {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error("useWebsiteData must be used within a WebsiteDataProvider");
  }
  return context;
}; 