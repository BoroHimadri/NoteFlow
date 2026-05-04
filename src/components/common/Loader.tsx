import React from "react";
import { Spinner } from "../ui/spinner";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-10 h-10 text-purple-600 animate-spin" />
        <p className="text-sm font-medium text-zinc-500 animate-pulse">
          Loading your note...
        </p>
      </div>
    </div>
  );
};

export default Loader;
