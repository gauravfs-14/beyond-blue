import React from "react";
import { Spotlight } from "./spotlight";
import { cn } from "@/lib/utils";

interface CosmicBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export const CosmicBackground = ({
  className,
  children,
}: CosmicBackgroundProps) => {
  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Original monotone background */}
      <div className="absolute inset-0 bg-background">
        {/* Single white spotlight from corner */}
        <Spotlight className="fixed top-0 left-0" fill="white" />

        {/* Cosmic models */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Distant planets with shadow and highlight */}
          <div className="fixed top-1/4 right-1/4 w-32 h-32 rounded-full blur-lg animate-pulse">
            {/* Shadow side */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/8 to-purple-600/8 rounded-full" />
            {/* Highlight side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-300/15 to-purple-500/15 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)" }}
            />
          </div>

          <div
            className="fixed bottom-1/3 left-1/6 w-24 h-24 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            {/* Shadow side */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-red-500/5 rounded-full" />
            {/* Highlight side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-orange-300/10 to-red-400/10 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)" }}
            />
          </div>

          <div
            className="fixed top-1/2 right-1/6 w-20 h-20 rounded-full blur-lg animate-pulse"
            style={{ animationDelay: "4s" }}
          >
            {/* Shadow side */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/4 to-cyan-500/4 rounded-full" />
            {/* Highlight side */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-green-300/8 to-cyan-400/8 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 60% 0%, 40% 100%, 0% 100%)" }}
            />
          </div>

          {/* Asteroid belt with shadow */}
          <div className="fixed top-1/3 left-1/2 w-2 h-2 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-white/15 rounded-full shadow-lg" />
            <div
              className="absolute inset-0 bg-white/25 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 70% 0%, 30% 100%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed top-1/3 left-1/2 w-1 h-1 rounded-full animate-pulse"
            style={{ animationDelay: "1s", transform: "translate(20px, 10px)" }}
          >
            <div className="absolute inset-0 bg-white/8 rounded-full shadow-md" />
            <div
              className="absolute inset-0 bg-white/18 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 70% 0%, 30% 100%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed top-1/3 left-1/2 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{
              animationDelay: "3s",
              transform: "translate(-15px, 25px)",
            }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full shadow-md" />
            <div
              className="absolute inset-0 bg-white/20 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 70% 0%, 30% 100%, 0% 100%)" }}
            />
          </div>

          {/* Nebula clouds with subtle lighting */}
          <div className="fixed top-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse">
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/4 to-transparent rounded-full" />
            <div
              className="absolute inset-0 bg-gradient-radial from-blue-300/8 to-transparent rounded-full"
              style={{ clipPath: "polygon(0% 0%, 50% 0%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed bottom-1/4 right-1/3 w-48 h-48 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-purple-500/3 to-transparent rounded-full" />
            <div
              className="absolute inset-0 bg-gradient-radial from-purple-300/6 to-transparent rounded-full"
              style={{ clipPath: "polygon(0% 0%, 50% 0%, 0% 100%)" }}
            />
          </div>

          {/* Stars with highlight */}
          <div className="fixed top-1/6 left-1/4 w-1 h-1 rounded-full animate-pulse">
            <div className="absolute inset-0 bg-white/20 rounded-full shadow-sm" />
            <div
              className="absolute inset-0 bg-white/35 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed top-1/5 right-1/3 w-1 h-1 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          >
            <div className="absolute inset-0 bg-white/12 rounded-full shadow-sm" />
            <div
              className="absolute inset-0 bg-white/25 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed bottom-1/5 left-1/5 w-1 h-1 rounded-full animate-pulse"
            style={{ animationDelay: "3s" }}
          >
            <div className="absolute inset-0 bg-white/15 rounded-full shadow-sm" />
            <div
              className="absolute inset-0 bg-white/28 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)" }}
            />
          </div>
          <div
            className="fixed bottom-1/6 right-1/4 w-1 h-1 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full shadow-sm" />
            <div
              className="absolute inset-0 bg-white/22 rounded-full"
              style={{ clipPath: "polygon(0% 0%, 80% 0%, 20% 100%, 0% 100%)" }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
