'use client';

import { InteractiveRobotSpline } from '@/components/ui/interactive-3d-robot';

export function InteractiveRobotSection() {
  const ROBOT_SCENE_URL = 'https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode';

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <InteractiveRobotSpline scene={ROBOT_SCENE_URL} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-0 z-10 px-4 pt-20 md:px-8 md:pt-32 lg:pt-40">
        <div className="mx-auto w-full max-w-2xl text-center text-white drop-shadow-lg">
          <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl xl:text-5xl">
            This is interactive 3d robot Whobee
          </h1>
        </div>
      </div>
    </div>
  );
}
