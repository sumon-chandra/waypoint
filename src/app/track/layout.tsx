import { Footer, Navbar } from "@/components/common";
import React from "react";

const TrackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default TrackLayout;
