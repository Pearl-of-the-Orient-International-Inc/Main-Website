"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type OnThisPageItem = {
  label: string;
  href: string;
};

type DocsContextType = {
  items: OnThisPageItem[];
  setItems: (items: OnThisPageItem[]) => void;
};

const DocsContext = createContext<DocsContextType>({
  items: [],
  setItems: () => {},
});

export const DocsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<OnThisPageItem[]>([]);
  return (
    <DocsContext.Provider value={{ items, setItems }}>
      {children}
    </DocsContext.Provider>
  );
};

export const useDocsContext = () => useContext(DocsContext);