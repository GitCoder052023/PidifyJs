import { ExternalLink } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="px-6 py-1.5 border-t border-gray-100 bg-white text-[10px] text-gray-400 flex justify-between items-center z-30">
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-medium">System Ready</span>
        </div>
        <span className="h-3 w-px bg-gray-200"></span>
        <span>React 19.2.3</span>
        <span>Next.js 16.1.3</span>
      </div>
      <div className="flex gap-5 items-center">
        <span className="flex items-center gap-1 hover:text-red-600 cursor-pointer transition-colors font-medium uppercase tracking-tighter">
          Documentation <ExternalLink size={10} />
        </span>
        <span className="text-gray-200">|</span>
        <span className="font-bold">v0.1.0-alpha</span>
      </div>
    </footer>
  );
};
