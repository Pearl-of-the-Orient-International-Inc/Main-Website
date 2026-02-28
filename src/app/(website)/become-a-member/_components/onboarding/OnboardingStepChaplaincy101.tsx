"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { CheckCircle2, Clock3, PlayCircle, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

import { api } from "../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../convex/_generated/dataModel";

type Props = {
  application: Doc<"personalInformation">;
};

type LessonItem = {
  id: number;
  title: string;
  duration: string;
  videoUrl: string;
};

type EssayQuestion = {
  id: number;
  prompt: string;
};

type StoredChaplaincyProgress = {
  completedLessons: number[];
  essayAnswers: Record<number, string>;
};

const SAMPLE_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const CHAPLAINCY_LESSONS: LessonItem[] = [
  { id: 1, title: "Biblical and Theological Foundation of Chaplaincy", duration: "28 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 2, title: "Role Identity and Calling of a Chaplain", duration: "22 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 3, title: "Pastoral Care Framework for Crisis Situations", duration: "35 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 4, title: "Trauma-Informed Spiritual Response", duration: "31 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 5, title: "Hospital and Bedside Ministry Protocols", duration: "26 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 6, title: "Community-Based Counseling and Referral", duration: "24 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 7, title: "Interfaith Sensitivity and Respectful Ministry", duration: "20 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 8, title: "Ethics, Confidentiality, and Documentation", duration: "27 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 9, title: "Disaster, Rescue, and Emergency Chaplaincy", duration: "30 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 10, title: "Family Care, Grief Support, and Bereavement", duration: "29 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 11, title: "Leadership Coordination and Case Endorsement", duration: "18 minutes", videoUrl: SAMPLE_VIDEO_URL },
  { id: 12, title: "Field Application, Reflection, and Readiness", duration: "25 minutes", videoUrl: SAMPLE_VIDEO_URL },
];

const ESSAY_QUESTIONS: EssayQuestion[] = [
  { id: 1, prompt: "In your own words, what distinguishes chaplaincy ministry from regular church ministry?" },
  { id: 2, prompt: "How does a chaplain demonstrate Christ-centered care while serving people of different beliefs?" },
  { id: 3, prompt: "Describe a practical framework you will use when encountering a person in emotional crisis." },
  { id: 4, prompt: "What are the most important boundaries a chaplain must maintain during one-on-one counseling?" },
  { id: 5, prompt: "How should a chaplain respond when a person asks questions about suffering and God during grief?" },
  { id: 6, prompt: "Explain how trauma-informed care changes the way you communicate with survivors." },
  { id: 7, prompt: "What is your process for documenting a ministry encounter while preserving confidentiality?" },
  { id: 8, prompt: "How will you discern when a case must be referred to a licensed professional?" },
  { id: 9, prompt: "What habits can help a chaplain avoid burnout and maintain spiritual health?" },
  { id: 10, prompt: "How can chaplains support families during terminal illness or end-of-life decisions?" },
  { id: 11, prompt: "Describe your approach when ministering in hospitals where time and access are limited." },
  { id: 12, prompt: "How should a chaplain coordinate with local leaders during disaster-response deployment?" },
  { id: 13, prompt: "What ethical risks are common in chaplaincy, and how will you avoid them?" },
  { id: 14, prompt: "How does active listening improve spiritual care outcomes in difficult conversations?" },
  { id: 15, prompt: "What role does prayer play when serving people who are uncertain or resistant?" },
  { id: 16, prompt: "How do you balance compassion with accountability when guiding someone in moral failure?" },
  { id: 17, prompt: "What is your personal philosophy of servant leadership as a chaplain?" },
  { id: 18, prompt: "How will you uphold the mission and values of Pearl of the Orient in field ministry?" },
  { id: 19, prompt: "Identify one potential ministry challenge you expect and outline your response plan." },
  { id: 20, prompt: "After this training, what concrete commitments will you practice in your first 90 days?" },
];

const totalLessons = CHAPLAINCY_LESSONS.length;
const totalEssayQuestions = ESSAY_QUESTIONS.length;

export function OnboardingStepChaplaincy101({ application }: Props) {
  const setOnboardingStep = useMutation(api.backend.membership.setOnboardingStep);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedTimeRef = useRef(0);
  const suppressSeekRef = useRef(false);

  const activeLesson = useMemo(
    () => CHAPLAINCY_LESSONS.find((lesson) => lesson.id === activeLessonId) ?? null,
    [activeLessonId],
  );

  const storageKey = useMemo(
    () => `chaplaincy101-progress-${application._id}`,
    [application._id],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredChaplaincyProgress;

      const validLessonIds = CHAPLAINCY_LESSONS.map((lesson) => lesson.id);
      const completedLessons = Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons.filter((id) => validLessonIds.includes(id))
        : [];

      const validQuestionIds = ESSAY_QUESTIONS.map((q) => q.id);
      const cleanedAnswers: Record<number, string> = {};
      if (parsed.essayAnswers && typeof parsed.essayAnswers === "object") {
        for (const id of validQuestionIds) {
          const answer = parsed.essayAnswers[id];
          if (typeof answer === "string") {
            cleanedAnswers[id] = answer;
          }
        }
      }

      setCompletedLessonIds(completedLessons);
      setEssayAnswers(cleanedAnswers);
    } catch {
      // ignore storage parsing errors
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const payload: StoredChaplaincyProgress = {
        completedLessons: completedLessonIds,
        essayAnswers,
      };
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [completedLessonIds, essayAnswers, storageKey]);

  const completedLessonsCount = completedLessonIds.length;
  const allLessonsCompleted = completedLessonsCount === totalLessons;

  const answeredCount = ESSAY_QUESTIONS.filter(
    (question) => (essayAnswers[question.id] ?? "").trim().length > 0,
  ).length;
  const allEssayQuestionsAnswered = answeredCount === totalEssayQuestions;

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

  const updateEssayAnswerAction = (questionId: number, value: string) => {
    setEssayAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canContinue = allLessonsCompleted && allEssayQuestionsAnswered;

  const handleContinue = async () => {
    if (!canContinue) return;
    setError(null);
    setLoading(true);
    try {
      await setOnboardingStep({ step: "id_generation" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to continue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
        <div className="space-y-4">
          <span className="inline-flex items-center rounded-md border border-[#032a0d]/20 bg-[#032a0d]/5 px-3 py-1 text-xs font-medium text-[#032a0d]">
            {totalLessons} deep-dive lessons
          </span>
          <h3 className="font-serif text-2xl text-[#032a0d] sm:text-3xl">
            Chaplaincy 101 Training
          </h3>
          <p className="text-sm text-[#032a0d]/80 sm:text-base">
            This module goes deeper into chaplain identity, crisis care,
            ethics, trauma-informed ministry, documentation, and field
            readiness.
          </p>
          <p className="text-sm text-[#032a0d]/80">
            Course progress:{" "}
            <span className="font-semibold text-[#032a0d]">
              {completedLessonsCount}/{totalLessons}
            </span>{" "}
            lessons completed
          </p>
          <p className="text-sm text-[#032a0d]/80">
            Assessment progress:{" "}
            <span className="font-semibold text-[#032a0d]">
              {answeredCount}/{totalEssayQuestions}
            </span>{" "}
            essay questions answered
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#032a0d]/10 bg-white">
          <Image
            src="/main/landing.jpg"
            alt="Chaplaincy 101 training preview"
            width={840}
            height={520}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#032a0d]/15">
        <div className="grid grid-cols-[70px_minmax(0,1fr)_130px_140px] bg-[#032a0d]/5 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#032a0d]/75 sm:grid-cols-[80px_minmax(0,1fr)_150px_170px] sm:px-4 sm:text-sm">
          <div>No</div>
          <div>Lesson Name</div>
          <div>Duration</div>
          <div>Status</div>
        </div>
        <ul className="divide-y divide-[#032a0d]/10 bg-white">
          {CHAPLAINCY_LESSONS.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            return (
              <li
                key={lesson.id}
                className="grid grid-cols-[70px_minmax(0,1fr)_130px_140px] items-center gap-2 px-3 py-3 text-sm text-[#032a0d] sm:grid-cols-[80px_minmax(0,1fr)_150px_170px] sm:px-4"
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

      {allLessonsCompleted ? (
        <section className="space-y-4 rounded-lg border border-[#032a0d]/15 bg-white p-4 sm:p-5">
          <div className="space-y-2">
            <h4 className="font-serif text-lg text-[#032a0d] sm:text-xl">
              Essay Assessment (20 Questions)
            </h4>
            <p className="text-sm text-[#032a0d]/80">
              Answer all questions in essay form after completing the course.
              Each response should be your personal reflection based on the
              training.
            </p>
          </div>

          <div className="space-y-4">
            {ESSAY_QUESTIONS.map((question) => (
              <div key={question.id} className="space-y-1.5">
                <label
                  htmlFor={`essay-question-${question.id}`}
                  className="flex items-start gap-2 text-sm font-medium text-[#032a0d]"
                >
                  <ScrollText className="mt-0.5 size-4 shrink-0 text-[#032a0d]/70" />
                  <span>
                    {question.id}. {question.prompt}
                  </span>
                </label>
                <Textarea
                  id={`essay-question-${question.id}`}
                  value={essayAnswers[question.id] ?? ""}
                  onChange={(e) =>
                    updateEssayAnswerAction(question.id, e.target.value)
                  }
                  placeholder="Write your answer here..."
                  className="min-h-28"
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-4 sm:px-5">
          <h4 className="font-serif text-lg text-amber-900 sm:text-xl">
            Essay Assessment (20 Questions)
          </h4>
          <p className="mt-1 text-sm text-amber-900/90">
            This assessment will appear after you complete all Chaplaincy 101
            lessons.
          </p>
        </section>
      )}

      {canContinue && (
        <div className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          Great. You completed Chaplaincy 101 and answered all essay questions.
          You can now continue to Oath Taking.
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
          disabled={!canContinue || loading}
          className="bg-[#032a0d] hover:bg-[#032a0d]/90"
        >
          {loading ? "Saving..." : "Continue to ID Generation"}
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
