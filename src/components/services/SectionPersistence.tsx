
import { useEffect } from "react";

interface SectionPersistenceProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const SectionPersistence = ({ activeSection, setActiveSection }: SectionPersistenceProps) => {
  // Load the saved section preference from localStorage
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, [setActiveSection]);

  // Save the section preference whenever it changes
  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);

  return null; // This is a behavior component, not a UI component
};

export default SectionPersistence;
