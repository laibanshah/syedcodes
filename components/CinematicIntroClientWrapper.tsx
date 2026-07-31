"use client";

import { useState } from "react";
import CinematicIntro from "./CinematicIntro";

export default function CinematicIntroClientWrapper() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  if (isIntroComplete) return null;

  return <CinematicIntro onComplete={() => setIsIntroComplete(true)} />;
}
