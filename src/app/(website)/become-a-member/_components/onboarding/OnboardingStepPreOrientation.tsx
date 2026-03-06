"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

type Props = {
  initialCompletedLessonIds: number[];
  onProgressChangeAction: (lessonIds: number[]) => Promise<void>;
  onContinueAction: (lessonIds: number[]) => Promise<void> | void;
};

type LessonItem = {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
};

const SAMPLE_VIDEO_URLS = [
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4#t=0,5",
  "https://www.w3schools.com/html/movie.mp4#t=0,5",
  "https://www.w3schools.com/html/mov_bbb.mp4#t=0,5",
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4#t=0,5",
  "https://download.samplelib.com/mp4/sample-5s.mp4",
];

const PRE_ORIENTATION_LESSONS: LessonItem[] = [
  {
    id: 1,
    title: "Mission and Vision of Pearl of the Orient",
    duration: "5 seconds",
    videoUrl: SAMPLE_VIDEO_URLS[0],
  },
  {
    id: 2,
    title: "History of Pearl of the Orient Chaplaincy",
    duration: "5 seconds",
    videoUrl: SAMPLE_VIDEO_URLS[1],
  },
  {
    id: 3,
    title: "Core Functions and Ministry Areas",
    duration: "5 seconds",
    videoUrl: SAMPLE_VIDEO_URLS[2],
  },
  {
    id: 4,
    title: "Biblical Principles in Chaplaincy Service",
    duration: "5 seconds",
    videoUrl: SAMPLE_VIDEO_URLS[3],
  },
  {
    id: 5,
    title: "Code of Conduct and Ethical Standards",
    duration: "5 seconds",
    videoUrl: SAMPLE_VIDEO_URLS[4],
  },
];

const totalLessons = PRE_ORIENTATION_LESSONS.length;

export function OnboardingStepPreOrientation({
  initialCompletedLessonIds,
  onProgressChangeAction,
  onContinueAction,
}: Props) {
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedTimeRef = useRef(0);
  const suppressSeekRef = useRef(false);
  const shouldAutoPlayRef = useRef(false);

  useEffect(() => {
    const validLessonIds = PRE_ORIENTATION_LESSONS.map((lesson) => lesson.id);
    setCompletedLessonIds(
      (initialCompletedLessonIds ?? []).filter((id) =>
        validLessonIds.includes(id),
      ),
    );
  }, [initialCompletedLessonIds]);

  const activeLesson =
    PRE_ORIENTATION_LESSONS.find((lesson) => lesson.id === activeLessonId) ??
    null;

  const completedCount = completedLessonIds.length;
  const allLessonsCompleted = completedCount === totalLessons;
  const progressPercent = (completedCount / totalLessons) * 100;

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

    if (shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      video.play().catch(() => {});
    }
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
    const endedLessonId = activeLessonId;
    setCompletedLessonIds((prev) => {
      const next = prev.includes(endedLessonId)
        ? prev
        : [...prev, endedLessonId].sort((a, b) => a - b);
      if (next !== prev) {
        void onProgressChangeAction(next);
      }
      return next;
    });

    const currentIndex = PRE_ORIENTATION_LESSONS.findIndex(
      (lesson) => lesson.id === endedLessonId,
    );
    const nextLesson = PRE_ORIENTATION_LESSONS[currentIndex + 1];

    if (nextLesson) {
      shouldAutoPlayRef.current = true;
      maxWatchedTimeRef.current = 0;
      setActiveLessonId(nextLesson.id);
      setIsVideoDialogOpen(true);
      return;
    }

    setIsVideoDialogOpen(false);
    setActiveLessonId(null);
  };

  const handleContinue = async () => {
    if (!allLessonsCompleted) return;
    setError(null);
    setLoading(true);
    try {
      await Promise.resolve(onContinueAction(completedLessonIds));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="overflow-hidden border border-black/10 bg-white">
        <div className="bg-[#032a0d] px-5 py-4 text-white">
          <h2 className="text-lg">Pre-orientation Course</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-3">
              <p className="text-sm text-[#032a0d]/80 sm:text-base">
                Mission and vision of Pearl of the Orient, history of
                chaplaincy, core functions, and foundational orientation topics
                for all incoming members.
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
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded border border-black/10 bg-white">
              <Image
                src="/main/hero.png"
                alt="Pre-orientation lesson preview"
                width={520}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Lesson Checklist
            </h3>
            <div className="h-px bg-black/10" />
            <div className="overflow-hidden rounded border border-[#032a0d]/15">
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
          </section>

          {allLessonsCompleted && (
            <div className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Great. You completed all lessons. You can now continue to Payment.
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Complete all lessons to unlock payment.
            </p>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!allLessonsCompleted || loading}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {loading ? "Saving..." : "Continue to Payment"}
            </Button>
          </div>
        </div>
      </div>

      <aside className="self-start lg:sticky lg:top-6">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">Training Checklist</h2>
          </div>
          <div className="space-y-3 p-5 text-sm text-neutral-700">
            {PRE_ORIENTATION_LESSONS.map((lesson) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const status = isCompleted ? "complete" : "pending";
              const statusConfig =
                status === "complete"
                  ? {
                      label: "Complete",
                      cardClass: "border-emerald-300 bg-emerald-50",
                      dotClass: "bg-emerald-600",
                    }
                  : {
                      label: "Pending",
                      cardClass: "border-black/10 bg-neutral-50",
                      dotClass: "bg-neutral-500",
                    };
              return (
                <div
                  key={lesson.id}
                  className={`rounded border px-3 py-2 ${statusConfig.cardClass}`}
                >
                  <p className="font-semibold text-[#032a0d]">
                    {lesson.id}. {lesson.title}
                  </p>
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
                    <span
                      className={`size-2 rounded-full ${statusConfig.dotClass}`}
                    />
                    {statusConfig.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

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
