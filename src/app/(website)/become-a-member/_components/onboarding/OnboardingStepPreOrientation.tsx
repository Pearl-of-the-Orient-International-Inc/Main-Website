"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, FileText, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  initialReadingConfirmed: boolean;
  initialAssessmentAnswers: Record<string, string>;
  onProgressChangeAction: (lessonIds: number[]) => Promise<void>;
  onMetaProgressChangeAction: (update: {
    preOrientationReadingConfirmed?: boolean;
    preOrientationAssessmentAnswers?: Record<string, string>;
  }) => void;
  onContinueAction: (lessonIds: number[]) => Promise<void> | void;
};

type AssessmentQuestion = {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  correctAnswer: string;
};

type VideoLesson = {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
};

const MINIMUM_WATCH_TIME_SECONDS = 5 * 60;

const PRE_ORIENTATION_VIDEOS: VideoLesson[] = [
  {
    id: 1,
    title:
      "Pearl of the Orient International Auxiliary Chaplain Values Educators on DZRH Radio Program",
    duration: "Video lesson 1",
    videoUrl:
      "https://cjeckc0z09.ufs.sh/f/BxBfZYEHOron1OdRmzKK5dWuMjSwVzJXNapq2iFIHoC4E1Bb",
  },
  {
    id: 2,
    title: "Chaplaincy 101 Seminar",
    duration: "Video lesson 2",
    videoUrl:
      "https://cjeckc0z09.ufs.sh/f/BxBfZYEHOron9ew6cxsA2zHamyMDUPBvO7KlGWgqk4t3FZo5",
  },
  {
    id: 3,
    title: "Chaplaincy 101 Orientation and Secretaries' Seminar",
    duration: "Video lesson 3",
    videoUrl:
      "https://cjeckc0z09.ufs.sh/f/BxBfZYEHOronM2cgwWuP3iFe5JCjAWORrbLkDl7X6axdVfwg",
  },
];

const MISSION_TEXT =
  "To organize a chaplain team both here and abroad who are professional, able, credible, available, initiative, and intelligent in delivering services to the people in all walks of life in times of their deepest and darkest moments of need.";

const VISION_TEXT =
  "Bring national transformation and nation building through Bible-based values education to different sectors of our society.";

const OBJECTIVES = [
  "Promote moral, ethical, professional, organizational, and spiritual values through seminars, lectures, dialogues, and conferences.",
  "Encourage and assist people in the community during times of need such as calamities, disasters, and untoward incidents.",
  "Connect with local, national, and international organizations and institutions for community services and development programs.",
  "Serve as volunteer chaplains in public and private institutions for humanitarian work.",
  "Initiate community-based programs that promote peace, unity, and progress in the country and around the globe.",
  "Intelligently perform the role and function of a chaplain in different sectors of society.",
];

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "q1",
    question: "What is the main focus of Pearl of the Orient's vision?",
    options: [
      {
        value: "a",
        label: "National transformation and nation building through Bible-based values education",
      },
      {
        value: "b",
        label: "Expanding only military chaplaincy operations",
      },
      {
        value: "c",
        label: "Building private businesses for members",
      },
      {
        value: "d",
        label: "Providing services only to church workers",
      },
    ],
    correctAnswer: "a",
  },
  {
    id: "q2",
    question:
      "According to the mission, what kind of chaplain team should be organized?",
    options: [
      {
        value: "a",
        label: "A team limited to one local area",
      },
      {
        value: "b",
        label: "A professional, credible, available, and intelligent team here and abroad",
      },
      {
        value: "c",
        label: "A team focused only on academic teaching",
      },
      {
        value: "d",
        label: "A team that works only during disasters",
      },
    ],
    correctAnswer: "b",
  },
  {
    id: "q3",
    question:
      "Which of the following is one of the stated objectives of the organization?",
    options: [
      {
        value: "a",
        label: "To avoid partnerships with outside institutions",
      },
      {
        value: "b",
        label: "To replace all community programs with online-only services",
      },
      {
        value: "c",
        label: "To connect with local, national, and international organizations for community service",
      },
      {
        value: "d",
        label: "To focus only on internal member activities",
      },
    ],
    correctAnswer: "c",
  },
  {
    id: "q4",
    question:
      "What kind of values does Pearl of the Orient aim to promote through seminars and conferences?",
    options: [
      {
        value: "a",
        label: "Only financial and political values",
      },
      {
        value: "b",
        label: "Moral, ethical, professional, organizational, and spiritual values",
      },
      {
        value: "c",
        label: "Only organizational values",
      },
      {
        value: "d",
        label: "Entertainment and social media values",
      },
    ],
    correctAnswer: "b",
  },
  {
    id: "q5",
    question:
      "Why does the organization initiate community-based programs according to its objectives?",
    options: [
      {
        value: "a",
        label: "To promote peace, unity, and progress",
      },
      {
        value: "b",
        label: "To compete with other institutions",
      },
      {
        value: "c",
        label: "To limit outreach to a few groups",
      },
      {
        value: "d",
        label: "To avoid humanitarian work",
      },
    ],
    correctAnswer: "a",
  },
];

export function OnboardingStepPreOrientation({
  initialCompletedLessonIds,
  initialReadingConfirmed,
  initialAssessmentAnswers,
  onProgressChangeAction,
  onMetaProgressChangeAction,
  onContinueAction,
}: Props) {
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [readingConfirmed, setReadingConfirmed] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedTimeRef = useRef(0);
  const suppressSeekRef = useRef(false);
  const watchedTimeByVideoRef = useRef<Record<number, number>>({});

  useEffect(() => {
    setCompletedLessonIds(
      (initialCompletedLessonIds ?? []).filter((lessonId) =>
        PRE_ORIENTATION_VIDEOS.some((video) => video.id === lessonId),
      ),
    );
  }, [initialCompletedLessonIds]);

  useEffect(() => {
    setReadingConfirmed(initialReadingConfirmed);
  }, [initialReadingConfirmed]);

  useEffect(() => {
    setAssessmentAnswers(initialAssessmentAnswers ?? {});
  }, [initialAssessmentAnswers]);

  const activeVideo =
    PRE_ORIENTATION_VIDEOS.find((video) => video.id === activeVideoId) ?? null;
  const activeVideoCompleted =
    activeVideoId !== null && completedLessonIds.includes(activeVideoId);
  const videosCompleted =
    PRE_ORIENTATION_VIDEOS.filter((video) =>
      completedLessonIds.includes(video.id),
    ).length === PRE_ORIENTATION_VIDEOS.length;
  const totalRequirements = 3;
  const assessmentAnsweredCount = ASSESSMENT_QUESTIONS.filter(
    (question) => assessmentAnswers[question.id],
  ).length;
  const assessmentPassed = ASSESSMENT_QUESTIONS.every(
    (question) => assessmentAnswers[question.id] === question.correctAnswer,
  );
  const completedRequirements = [
    videosCompleted,
    readingConfirmed,
    assessmentPassed,
  ].filter(Boolean).length;
  const progressPercent = (completedRequirements / totalRequirements) * 100;
  const canContinue = videosCompleted && readingConfirmed && assessmentPassed;

  const openVideoDialogAction = (videoId: number) => {
    setActiveVideoId(videoId);
    maxWatchedTimeRef.current = watchedTimeByVideoRef.current[videoId] ?? 0;
    setIsVideoDialogOpen(true);
  };

  const handleVideoLoadedMetadataAction = () => {
    const video = videoRef.current;
    if (!video || !activeVideoId) return;

    const resumeTime = watchedTimeByVideoRef.current[activeVideoId] ?? 0;
    if (resumeTime > 0) {
      video.currentTime = Math.min(resumeTime, video.duration || resumeTime);
    }

    maxWatchedTimeRef.current = resumeTime;
  };

  const handleVideoTimeUpdateAction = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > maxWatchedTimeRef.current) {
      maxWatchedTimeRef.current = video.currentTime;
    }
    if (
      !activeVideoId ||
      video.currentTime <= (watchedTimeByVideoRef.current[activeVideoId] ?? 0)
    ) {
      return;
    }

    watchedTimeByVideoRef.current[activeVideoId] = video.currentTime;

    if (
      activeVideoId &&
      !completedLessonIds.includes(activeVideoId) &&
      maxWatchedTimeRef.current >= MINIMUM_WATCH_TIME_SECONDS
    ) {
      const nextCompletedLessonIds = [...completedLessonIds, activeVideoId].sort(
        (a, b) => a - b,
      );

      setCompletedLessonIds(nextCompletedLessonIds);
      void onProgressChangeAction(nextCompletedLessonIds);
    }
  };

  const handleVideoSeekingAction = () => {
    const video = videoRef.current;
    if (!video || suppressSeekRef.current) return;
    if (activeVideoId && completedLessonIds.includes(activeVideoId)) return;

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
    if (!activeVideoId) return;

    const nextCompletedLessonIds = completedLessonIds.includes(activeVideoId)
      ? completedLessonIds
      : [...completedLessonIds, activeVideoId].sort((a, b) => a - b);

    if (videoRef.current?.duration) {
      watchedTimeByVideoRef.current[activeVideoId] = videoRef.current.duration;
      maxWatchedTimeRef.current = videoRef.current.duration;
    }

    setCompletedLessonIds(nextCompletedLessonIds);
    if (nextCompletedLessonIds !== completedLessonIds) {
      void onProgressChangeAction(nextCompletedLessonIds);
    }
  };

  const handleVideoDialogOpenChange = (open: boolean) => {
    if (open) {
      setIsVideoDialogOpen(true);
      return;
    }

    if (!activeVideoCompleted) return;

    setIsVideoDialogOpen(false);
    setActiveVideoId(null);
  };

  const handleReadingConfirmedChange = (checked: boolean) => {
    setReadingConfirmed(checked);
    onMetaProgressChangeAction({
      preOrientationReadingConfirmed: checked,
    });
  };

  const handleAssessmentAnswerChange = (
    questionId: string,
    answer: string,
  ) => {
    const nextAssessmentAnswers = {
      ...assessmentAnswers,
      [questionId]: answer,
    };

    setAssessmentAnswers(nextAssessmentAnswers);
    onMetaProgressChangeAction({
      preOrientationAssessmentAnswers: nextAssessmentAnswers,
    });
  };

  const handleContinue = async () => {
    if (!canContinue) {
      setError(
        "Finish all three videos, confirm the reading, and answer all five assessment questions correctly before continuing.",
      );
      return;
    }
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
                Complete all three orientation videos, read the mission, vision,
                and objectives, then pass the short assessment to unlock payment.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                  Free
                </span>
                <span className="text-xs text-[#032a0d]/65 sm:text-sm">
                  Three video lessons, required reading, and 5-question assessment.
                </span>
              </div>
              <p className="text-sm text-[#032a0d]/80">
                Progress:{" "}
                <span className="font-semibold text-[#032a0d]">
                  {completedRequirements}/{totalRequirements}
                </span>{" "}
                requirements completed
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
            <h3 className="font-serif text-xl text-[#032a0d]">Video Lessons</h3>
            <div className="h-px bg-black/10" />
            <div className="space-y-3 rounded border border-[#032a0d]/15 bg-white p-4">
              {PRE_ORIENTATION_VIDEOS.map((video, index) => {
                const videoCompleted = completedLessonIds.includes(video.id);

                return (
                  <div
                    key={video.id}
                    className="grid gap-4 rounded border border-[#032a0d]/10 p-4 md:grid-cols-[minmax(0,1fr)_180px_160px] md:items-center"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#032a0d]/65">
                        Lesson {index + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => openVideoDialogAction(video.id)}
                        className="mt-1 flex items-center gap-2 text-left text-[#032a0d] hover:text-[#032a0d]/80"
                      >
                        <PlayCircle className="size-4 shrink-0 text-[#032a0d]/70" />
                        <span className="font-medium underline-offset-2 hover:underline">
                          {video.title}
                        </span>
                      </button>
                    </div>
                    <p className="flex items-center gap-1 text-sm text-[#032a0d]/70">
                      <Clock3 className="size-3.5 shrink-0" />
                      {video.duration}
                    </p>
                    {videoCompleted ? (
                      <span className="inline-flex items-center justify-center gap-1 rounded-md border border-[#032a0d]/20 px-2 py-1 text-xs font-medium text-[#032a0d]">
                        <CheckCircle2 className="size-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-md border border-dashed border-[#032a0d]/20 px-2 py-1 text-xs text-[#032a0d]/70">
                        Watch video to complete
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Mission, Vision, and Objectives
            </h3>
            <div className="h-px bg-black/10" />
            <div className="rounded border border-[#032a0d]/15 bg-neutral-50 p-4">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-[#032a0d]">Mission</p>
                  <p className="mt-2 text-sm leading-7 text-[#032a0d]/80">
                    {MISSION_TEXT}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#032a0d]">Vision</p>
                  <p className="mt-2 text-sm leading-7 text-[#032a0d]/80">
                    {VISION_TEXT}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#032a0d]">
                    Objectives
                  </p>
                  <ul className="mt-2 space-y-2 text-sm leading-7 text-[#032a0d]/80">
                    {OBJECTIVES.map((objective) => (
                      <li key={objective} className="flex items-center gap-1.5">
                        <span className="size-1.25 shrink-0 rounded-full bg-[#032a0d]" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <label className="mt-5 flex items-start gap-3 rounded border border-dashed border-[#032a0d]/20 bg-white px-3 py-3 text-sm text-[#032a0d]">
                <Checkbox
                  checked={readingConfirmed}
                  onCheckedChange={(checked) =>
                    handleReadingConfirmedChange(checked === true)
                  }
                  className="mt-0.5"
                />
                <span>
                  I have finished reading the mission, vision, and objectives.
                </span>
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Assessment
            </h3>
            <div className="h-px bg-black/10" />
            <div className="space-y-4">
              {ASSESSMENT_QUESTIONS.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded border border-[#032a0d]/15 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-[#032a0d]">
                    {index + 1}. {question.question}
                  </p>
                  <RadioGroup
                    value={assessmentAnswers[question.id] ?? ""}
                    onValueChange={(value) =>
                      handleAssessmentAnswerChange(question.id, value)
                    }
                    className="mt-3 gap-2"
                  >
                    {question.options.map((option) => {
                      const fieldId = `${question.id}-${option.value}`;
                      return (
                        <div
                          key={option.value}
                          className="flex cursor-pointer items-start gap-3 rounded border border-[#032a0d]/10 px-3 py-3 text-sm text-[#032a0d]/85 hover:bg-[#032a0d]/3"
                        >
                          <RadioGroupItem
                            id={fieldId}
                            value={option.value}
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor={fieldId}
                            className="cursor-pointer text-sm leading-6 font-normal"
                          >
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
            </div>
            <div className="rounded border border-dashed border-[#032a0d]/20 bg-[#032a0d]/5 px-4 py-3 text-sm text-[#032a0d]/80">
              Answer all 5 questions correctly to continue.
            </div>
            {assessmentAnsweredCount === ASSESSMENT_QUESTIONS.length &&
            !assessmentPassed ? (
              <p className="text-sm text-amber-700">
                Some assessment answers are incorrect. Review the reading and try
                again.
              </p>
            ) : null}
            {assessmentPassed ? (
              <p className="text-sm text-emerald-700">
                Assessment passed. You can continue once the videos and reading are
                also complete.
              </p>
            ) : null}
          </section>

          {canContinue ? (
            <div className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Great. You completed the pre-orientation course and assessment. You
              can now continue to Payment.
            </div>
          ) : null}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Finish all videos, the reading, and the assessment to unlock payment.
            </p>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || loading}
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
            <ChecklistCard
              icon={PlayCircle}
              title="Watch all 3 orientation videos"
              complete={videosCompleted}
            />
            <ChecklistCard
              icon={FileText}
              title="Read mission, vision, and objectives"
              complete={readingConfirmed}
            />
            <ChecklistCard
              icon={CheckCircle2}
              title="Pass the 5-question assessment"
              complete={assessmentPassed}
            />
          </div>
        </div>
      </aside>

      <Dialog open={isVideoDialogOpen} onOpenChange={handleVideoDialogOpenChange}>
        <DialogContent
          className="max-w-4xl! p-0"
          showCloseButton={activeVideoCompleted}
          onInteractOutside={(event) => {
            if (!activeVideoCompleted) {
              event.preventDefault();
            }
          }}
          onEscapeKeyDown={(event) => {
            if (!activeVideoCompleted) {
              event.preventDefault();
            }
          }}
        >
          <div className="space-y-3 p-4 sm:p-5">
            <DialogTitle className="font-serif text-lg text-[#032a0d] sm:text-xl">
              {activeVideo?.title ?? "Pre-orientation video"}
            </DialogTitle>
            <p className="text-xs text-[#032a0d]/70 sm:text-sm">
              Fast forward is disabled. Watch at least 5 minutes to mark this
              video as completed automatically.
            </p>
          </div>
          <VideoPlayer className="overflow-hidden">
            <VideoPlayerContent
              key={activeVideo?.id ?? "pre-orientation-video"}
              ref={videoRef}
              slot="media"
              src={activeVideo?.videoUrl}
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

function ChecklistCard({
  icon: Icon,
  title,
  complete,
}: {
  icon: typeof PlayCircle;
  title: string;
  complete: boolean;
}) {
  return (
    <div
      className={[
        "rounded border px-3 py-2",
        complete
          ? "border-emerald-300 bg-emerald-50"
          : "border-black/10 bg-neutral-50",
      ].join(" ")}
    >
      <p className="flex items-center gap-2 font-semibold text-[#032a0d]">
        <Icon className="size-4" />
        {title}
      </p>
      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
        <span
          className={[
            "size-2 rounded-full",
            complete ? "bg-emerald-600" : "bg-neutral-500",
          ].join(" ")}
        />
        {complete ? "Complete" : "Pending"}
      </p>
    </div>
  );
}
