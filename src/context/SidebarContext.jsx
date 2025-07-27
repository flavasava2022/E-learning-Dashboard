import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  function openNavbar() {
    setIsOpen(!isOpen);
  }

  return (
    <SidebarContext.Provider value={{ isOpen, openNavbar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
