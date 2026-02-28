"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { CheckCircle2, Clock3, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/components/kibo-ui/video-player";

import { Doc } from "../../../../../../convex/_generated/dataModel";
import { api } from "../../../../../../convex/_generated/api";

type Props = {
  application: Doc<"personalInformation">;
};

type LessonItem = {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
};

type StoredProgress = {
  unlocked?: number[];
  completed: number[];
};

const SAMPLE_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const PRE_ORIENTATION_LESSONS: LessonItem[] = [
  {
    id: 1,
    title: "Mission and Vision of Pearl of the Orient",
    duration: "18 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 2,
    title: "History of Pearl of the Orient Chaplaincy",
    duration: "24 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 3,
    title: "Core Functions and Ministry Areas",
    duration: "21 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 4,
    title: "Biblical Principles in Chaplaincy Service",
    duration: "20 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 5,
    title: "Code of Conduct and Ethical Standards",
    duration: "16 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 6,
    title: "Organizational Structure and Leadership Flow",
    duration: "14 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 7,
    title: "Government Accreditation and Legal Mandates",
    duration: "17 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 8,
    title: "Volunteer Expectations and Member Responsibilities",
    duration: "13 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 9,
    title: "Community Engagement and Disaster Response",
    duration: "19 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
  {
    id: 10,
    title: "Pre-orientation Wrap-up and Next Step Guide",
    duration: "10 minutes",
    videoUrl: SAMPLE_VIDEO_URL,
  },
];

const totalLessons = PRE_ORIENTATION_LESSONS.length;

export function OnboardingStepPreOrientation({ application }: Props) {
  const setOnboardingStep = useMutation(
    api.backend.membership.setOnboardingStep,
  );
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedTimeRef = useRef(0);
  const suppressSeekRef = useRef(false);

  const activeLesson = useMemo(
    () =>
      PRE_ORIENTATION_LESSONS.find((lesson) => lesson.id === activeLessonId) ??
      null,
    [activeLessonId],
  );

  const storageKey = useMemo(
    () => `preorientation-progress-${application._id}`,
    [application._id],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredProgress;

      const validLessonIds = PRE_ORIENTATION_LESSONS.map((lesson) => lesson.id);
      const completed = Array.isArray(parsed.completed)
        ? parsed.completed.filter((id) => validLessonIds.includes(id))
        : Array.isArray(parsed.unlocked)
          ? parsed.unlocked.filter((id) => validLessonIds.includes(id))
        : [];

      setCompletedLessonIds(completed);
    } catch {
      // ignore storage parsing errors
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload: StoredProgress = {
        completed: completedLessonIds,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [completedLessonIds, storageKey]);

  const completedCount = completedLessonIds.length;
  const allLessonsCompleted = completedCount === totalLessons;

  const openLessonDialogAction = (lessonId: number) => {
    setActiveLessonId(lessonId);
    maxWatchedTimeRef.current = 0;
    setIsVideoDialogOpen(true);
  };

  const handleVideoLoadedMetadataAction = () => {
    if (!activeLessonId) return;
    if (!completedLessonIds.includes(activeLessonId)) {
      maxWatchedTimeRef.current = 0;
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    maxWatchedTimeRef.current = video.duration;
  };

  const handleVideoTimeUpdateAction = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > maxWatchedTimeRef.current) {
      maxWatchedTimeRef.current = video.currentTime;
    }
  };

  const handleVideoSeekingAction = () => {
    const video = videoRef.current;
    if (!video || suppressSeekRef.current) return;
    if (activeLessonId && completedLessonIds.includes(activeLessonId)) return;

    const allowedTime = maxWatchedTimeRef.current + 0.75;
    if (video.currentTime <= allowedTime) return;

    suppressSeekRef.current = true;
    video.currentTime = maxWatchedTimeRef.current;
    window.setTimeout(() => {
      suppressSeekRef.current = false;
    }, 0);
  };

  const handleVideoRateChangeAction = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.playbackRate !== 1) {
      video.playbackRate = 1;
    }
  };

  const handleVideoEndedAction = () => {
    if (!activeLessonId) return;
    setCompletedLessonIds((prev) =>
      prev.includes(activeLessonId) ? prev : [...prev, activeLessonId],
    );
    setIsVideoDialogOpen(false);
    setActiveLessonId(null);
  };

  const handleContinue = async () => {
    if (!allLessonsCompleted) return;
    setError(null);
    setLoading(true);
    try {
      await setOnboardingStep({ step: "chaplaincy_101" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-md border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d]">
            {totalLessons} lessons
          </span>
          <h3 className="font-serif text-2xl text-[#032a0d] sm:text-3xl">
            Pre-orientation Course
          </h3>
          <p className="text-sm text-[#032a0d]/80 sm:text-base">
            Mission and vision of Pearl of the Orient, history of chaplaincy,
            core functions, and foundational orientation topics for all incoming
            members.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              Free
            </span>
            <span className="text-xs text-[#032a0d]/65 sm:text-sm">
              No assessment. Watch each lesson to the end.
            </span>
          </div>
          <p className="text-sm text-[#032a0d]/80">
            Progress:{" "}
            <span className="font-semibold text-[#032a0d]">
              {completedCount}/{totalLessons}
            </span>{" "}
            lessons completed
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#032a0d]/10 bg-white">
          <Image
            src="/main/hero.png"
            alt="Pre-orientation lesson preview"
            width={840}
            height={520}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#032a0d]/15">
        <div className="grid grid-cols-[70px_minmax(0,1fr)_120px_130px] bg-[#032a0d]/5 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#032a0d]/75 sm:grid-cols-[80px_minmax(0,1fr)_150px_170px] sm:px-4 sm:text-sm">
          <div>No</div>
          <div>Lesson Name</div>
          <div>Duration</div>
          <div>Status</div>
        </div>
        <ul className="divide-y divide-[#032a0d]/10 bg-white">
          {PRE_ORIENTATION_LESSONS.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            return (
              <li
                key={lesson.id}
                className="grid grid-cols-[70px_minmax(0,1fr)_120px_130px] items-center gap-2 px-3 py-3 text-sm text-[#032a0d] sm:grid-cols-[80px_minmax(0,1fr)_150px_170px] sm:px-4"
              >
                <div className="flex items-center">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#032a0d]/15 bg-[#032a0d]/5 text-xs font-medium sm:size-9 sm:text-sm">
                    {lesson.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openLessonDialogAction(lesson.id)}
                  className="flex items-center gap-2 pr-2 text-left text-[#032a0d] hover:text-[#032a0d]/80"
                >
                  <PlayCircle className="size-4 shrink-0 text-[#032a0d]/70" />
                  <span className="underline-offset-2 hover:underline">
                    {lesson.title}
                  </span>
                </button>
                <p className="flex items-center gap-1 text-xs text-[#032a0d]/70 sm:text-sm">
                  <Clock3 className="size-3.5 shrink-0" />
                  {lesson.duration}
                </p>
                {isCompleted ? (
                  <span className="inline-flex items-center justify-center gap-1 rounded-md border border-[#032a0d]/20 px-2 py-1 text-xs font-medium text-[#032a0d]">
                    <CheckCircle2 className="size-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-md border border-dashed border-[#032a0d]/20 px-2 py-1 text-xs text-[#032a0d]/70">
                    Watch video to complete
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {allLessonsCompleted && (
        <div className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Great. You completed all lessons. You can now continue to Chaplaincy
          101.
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleContinue}
          disabled={!allLessonsCompleted || loading}
          className="bg-[#032a0d] hover:bg-[#032a0d]/90"
        >
          {loading ? "Saving..." : "Continue to Chaplaincy 101"}
        </Button>
      </div>

      <Dialog open={isVideoDialogOpen}>
        <DialogContent
          className="max-w-4xl! p-0"
          showCloseButton={false}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <div className="space-y-3 p-4 sm:p-5">
            <DialogTitle className="font-serif text-lg text-[#032a0d] sm:text-xl">
              {activeLesson?.title ?? "Lesson"}
            </DialogTitle>
            <p className="text-xs text-[#032a0d]/70 sm:text-sm">
              Fast forward is disabled. Please watch the lesson until the end to
              mark this lesson as completed automatically.
            </p>
          </div>
          <VideoPlayer className="overflow-hidden">
            <VideoPlayerContent
              key={activeLesson?.id}
              ref={videoRef}
              slot="media"
              src={activeLesson?.videoUrl}
              preload="auto"
              playsInline
              className="h-auto max-h-[70vh] w-full"
              onLoadedMetadata={handleVideoLoadedMetadataAction}
              onTimeUpdate={handleVideoTimeUpdateAction}
              onSeeking={handleVideoSeekingAction}
              onRateChange={handleVideoRateChangeAction}
              onEnded={handleVideoEndedAction}
              onContextMenu={(event) => event.preventDefault()}
            />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerTimeRange />
              <VideoPlayerTimeDisplay showDuration />
              <VideoPlayerMuteButton />
              <VideoPlayerVolumeRange />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
