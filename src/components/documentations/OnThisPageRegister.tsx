/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { useDocsContext, OnThisPageItem } from "@/lib/docs-context";

export const OnThisPageRegister = ({ items }: { items: OnThisPageItem[] }) => {
  const { setItems } = useDocsContext();
  useEffect(() => {
    setItems(items);
    return () => setItems([]);
  }, []);
  return null;
};
