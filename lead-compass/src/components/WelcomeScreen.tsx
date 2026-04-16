import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mountain, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [fading, setFading] = useState(false);

  const handleEnter = () => {
    setFading(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center gradient-hero transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}
    >
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-accent shadow-elevated">
            <Mountain className="h-10 w-10 text-accent-foreground" />
          </div>
        </div>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
          Welcome to
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-2">
          Everest Team
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground/80 mb-4">
          ML Project
        </h2>
        <p className="text-primary-foreground/60 text-base max-w-md mx-auto mb-8">
          AI-powered lead conversion prediction to drive smarter sales decisions
        </p>
        <Button
          onClick={handleEnter}
          size="lg"
          className="gradient-accent text-accent-foreground text-base font-bold px-8 h-12 hover:opacity-90 transition-opacity shadow-elevated"
        >
          Enter Dashboard
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
