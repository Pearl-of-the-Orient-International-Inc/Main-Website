"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileText, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  initialCompletedLessonIds: number[];
  initialEssayAnswers: Record<number, string>;
  onProgressChangeAction: (payload: {
    completedLessonIds: number[];
    essayAnswers: Record<number, string>;
    isCompleted?: boolean;
  }) => Promise<void>;
  onContinueAction: (payload: {
    completedLessonIds: number[];
    essayAnswers: Record<number, string>;
  }) => Promise<void> | void;
};

type LessonItem = {
  id: number;
  title: string;
  duration: string;
  filePath: string;
};

type EssayQuestion = {
  id: number;
  prompt: string;
};

const CHAPLAINCY_LESSONS: LessonItem[] = [
  {
    id: 1,
    title: "The Chaplaincy",
    duration: "PPT Lesson",
    filePath: "/chaplaincy-training-course/Lesson1. THE CHAPLAINCY.ppsx",
  },
  {
    id: 2,
    title: "What Is a Chaplain",
    duration: "PPT Lesson",
    filePath: "/chaplaincy-training-course/Lesson2. WHAT IS A CHAPLAIN.ppsx",
  },
  {
    id: 3,
    title: "What Does a Pearl Chaplain Do",
    duration: "PPT Lesson",
    filePath:
      "/chaplaincy-training-course/Lesson3. WHAT DOES A PEARL CHAPLAIN DO.ppsx",
  },
  {
    id: 4,
    title: "Chaplain vs. Pastor",
    duration: "PPT Lesson",
    filePath: "/chaplaincy-training-course/Lesson4. CHAPLAIN VS. PASTOR.ppsx",
  },
  {
    id: 5,
    title: "Types of Chaplaincies",
    duration: "PPT Lesson",
    filePath: "/chaplaincy-training-course/Lesson5. TYPES OF CHAPLAINCIES.ppsx",
  },
  {
    id: 6,
    title: "Professional Ethics for Pearl Chaplaincy",
    duration: "PPT Lesson",
    filePath:
      "/chaplaincy-training-course/Lesson6. PROFESSIONAL ETHICS FOR PEARL CHAPLAINCY.ppsx",
  },
  {
    id: 7,
    title: "Chaplains Courtesy and Discipline",
    duration: "PPT Lesson",
    filePath:
      "/chaplaincy-training-course/Lesson7. CHAPLAINS COURTESY & DISCIPLINE.ppsx",
  },
  {
    id: 8,
    title: "Pearl Chaplaincy Membership",
    duration: "PPT Lesson",
    filePath:
      "/chaplaincy-training-course/Lesson8. PEARL CHAPLAINCY MEMBERSHIP.ppsx",
  },
];

const ESSAY_QUESTIONS: EssayQuestion[] = [
  {
    id: 1,
    prompt:
      "In your own words, what distinguishes chaplaincy ministry from regular church ministry?",
  },
  {
    id: 2,
    prompt:
      "How does a chaplain demonstrate Christ-centered care while serving people of different beliefs?",
  },
  {
    id: 3,
    prompt:
      "Describe a practical framework you will use when encountering a person in emotional crisis.",
  },
  {
    id: 4,
    prompt:
      "What are the most important boundaries a chaplain must maintain during one-on-one counseling?",
  },
  {
    id: 5,
    prompt:
      "How should a chaplain respond when a person asks questions about suffering and God during grief?",
  },
  {
    id: 6,
    prompt:
      "Explain how trauma-informed care changes the way you communicate with survivors.",
  },
  {
    id: 7,
    prompt:
      "What is your process for documenting a ministry encounter while preserving confidentiality?",
  },
  {
    id: 8,
    prompt:
      "How will you discern when a case must be referred to a licensed professional?",
  },
  {
    id: 9,
    prompt:
      "What habits can help a chaplain avoid burnout and maintain spiritual health?",
  },
  {
    id: 10,
    prompt:
      "How can chaplains support families during terminal illness or end-of-life decisions?",
  },
];

const totalLessons = CHAPLAINCY_LESSONS.length;
const totalEssayQuestions = ESSAY_QUESTIONS.length;

export function OnboardingStepChaplaincy101({
  initialCompletedLessonIds,
  initialEssayAnswers,
  onProgressChangeAction,
  onContinueAction,
}: Props) {
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [origin, setOrigin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    setCompletedLessonIds(initialCompletedLessonIds ?? []);
    setEssayAnswers(initialEssayAnswers ?? {});
  }, [initialCompletedLessonIds, initialEssayAnswers]);

  const completedLessonsCount = completedLessonIds.length;
  const allLessonsCompleted = completedLessonsCount === totalLessons;

  const answeredCount = ESSAY_QUESTIONS.filter(
    (question) => (essayAnswers[question.id] ?? "").trim().length > 0,
  ).length;
  const allEssayQuestionsAnswered = answeredCount === totalEssayQuestions;
  const lessonProgressPercent = (completedLessonsCount / totalLessons) * 100;
  const essayProgressPercent = (answeredCount / totalEssayQuestions) * 100;

  const openLessonAction = (lesson: LessonItem) => {
    setActiveLesson(lesson);
    setIsLessonDialogOpen(true);
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lesson.id)
        ? prev
        : [...prev, lesson.id].sort((a, b) => a - b);
      if (next !== prev) {
        void onProgressChangeAction({
          completedLessonIds: next,
          essayAnswers,
        });
      }
      return next;
    });
  };

  const activeLessonViewerUrl = useMemo(() => {
    if (!activeLesson || !origin) return "";
    const absoluteLessonUrl = `${origin}${activeLesson.filePath}`;
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteLessonUrl)}`;
  }, [activeLesson, origin]);

  const updateEssayAnswerAction = (questionId: number, value: string) => {
    setEssayAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const canContinue = allLessonsCompleted && allEssayQuestionsAnswered;

  const persistProgress = async (answersToSave: Record<number, string>) => {
    await onProgressChangeAction({
      completedLessonIds,
      essayAnswers: answersToSave,
      isCompleted: false,
    });
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    setError(null);
    setLoading(true);
    try {
      await onProgressChangeAction({
        completedLessonIds,
        essayAnswers,
        isCompleted: true,
      });
      await Promise.resolve(onContinueAction({ completedLessonIds, essayAnswers }));
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
          <h2 className="text-lg">Chaplaincy 101 Training</h2>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-3">
              <p className="text-sm text-[#032a0d]/80 sm:text-base">
                This module contains 8 PowerPoint lessons for chaplain identity,
                ethics, discipline, and core service orientation.
              </p>
              <p className="text-sm text-[#032a0d]/80">
                Course progress:{" "}
                <span className="font-semibold text-[#032a0d]">
                  {completedLessonsCount}/{totalLessons}
                </span>{" "}
                lessons completed
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
                  style={{ width: `${lessonProgressPercent}%` }}
                />
              </div>
              <p className="text-sm text-[#032a0d]/80">
                Assessment progress:{" "}
                <span className="font-semibold text-[#032a0d]">
                  {answeredCount}/{totalEssayQuestions}
                </span>{" "}
                essay questions answered
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-[#032a0d] transition-all duration-300"
                  style={{ width: `${essayProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="overflow-hidden rounded border border-black/10 bg-white">
              <Image
                src="/main/landing.jpg"
                alt="Chaplaincy 101 training preview"
                width={520}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">Lesson Checklist</h3>
            <div className="h-px bg-black/10" />
            <div className="overflow-hidden rounded border border-[#032a0d]/15">
              <div className="grid grid-cols-[70px_minmax(0,1fr)_130px_140px] bg-[#032a0d]/5 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[#032a0d]/75 sm:grid-cols-[80px_minmax(0,1fr)_150px_170px] sm:px-4 sm:text-sm">
                <div>No</div>
                <div>Lesson Name</div>
                <div>Material</div>
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
                        onClick={() => openLessonAction(lesson)}
                        className="flex items-center gap-2 pr-2 text-left text-[#032a0d] hover:text-[#032a0d]/80"
                      >
                        <FileText className="size-4 shrink-0 text-[#032a0d]/70" />
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
                          Open PPT to complete
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl text-[#032a0d]">
              Essay Assessment ({totalEssayQuestions} Questions)
            </h3>
            <div className="h-px bg-black/10" />
            {allLessonsCompleted ? (
              <div className="space-y-4 rounded border border-[#032a0d]/15 bg-white p-4 sm:p-5">
                <p className="text-sm text-[#032a0d]/80">
                  Answer all questions in essay form after completing the
                  course. Each response should be your personal reflection based
                  on the training.
                </p>
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
                        onChange={(e) => updateEssayAnswerAction(question.id, e.target.value)}
                        onBlur={() => void persistProgress(essayAnswers)}
                        placeholder="Write your answer here..."
                        className="min-h-28"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded border border-amber-300 bg-amber-50 px-4 py-4 sm:px-5">
                <p className="text-sm text-amber-900/90">
                  This assessment will appear after you complete all Chaplaincy
                  101 PPT lessons.
                </p>
              </div>
            )}
          </section>

          {canContinue && (
            <div className="rounded-md border border-emerald-700/20 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Great. You completed Chaplaincy 101 and answered all essay
              questions. You can now continue to Oath Taking.
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 sm:text-sm">
              Complete the PPT lessons and essay assessment to unlock the next
              step.
            </p>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue || loading}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {loading ? "Saving..." : "Continue to Oath Taking"}
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
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">
                Lessons: {completedLessonsCount}/{totalLessons}
              </p>
              <p className="mt-1 text-xs text-[#032a0d]/70">
                {allLessonsCompleted ? "Complete" : "Pending"}
              </p>
            </div>
            <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
              <p className="font-semibold text-[#032a0d]">
                Essays: {answeredCount}/{totalEssayQuestions}
              </p>
              <p className="mt-1 text-xs text-[#032a0d]/70">
                {allEssayQuestionsAnswered ? "Complete" : "Pending"}
              </p>
            </div>
            <div className="rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
              Open each PPT lesson once to mark it as completed before answering
              the essay assessment.
            </div>
          </div>
        </div>
      </aside>

      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent className="max-w-5xl! p-0">
          <div className="space-y-2 border-b border-black/10 p-4 sm:p-5">
            <DialogTitle className="font-serif text-lg text-[#032a0d] sm:text-xl">
              {activeLesson?.title ?? "Lesson"}
            </DialogTitle>
            <p className="text-xs text-[#032a0d]/70 sm:text-sm">
              PowerPoint lesson preview. If viewer is unavailable, open the file
              in a new tab.
            </p>
          </div>

          <div className="p-4 sm:p-5">
            {activeLessonViewerUrl ? (
              <iframe
                title={activeLesson?.title ?? "Chaplaincy lesson"}
                src={activeLessonViewerUrl}
                className="h-[70vh] w-full rounded border border-black/10 bg-white"
              />
            ) : (
              <div className="flex h-[55vh] items-center justify-center rounded border border-dashed border-black/15 bg-neutral-50 text-sm text-[#032a0d]/70">
                Preparing lesson preview...
              </div>
            )}

            {activeLesson && (
              <div className="mt-3">
                <a
                  href={encodeURI(activeLesson.filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-md border border-[#032a0d]/30 px-3 text-xs text-[#032a0d] hover:bg-[#032a0d]/5"
                >
                  Open Lesson in New Tab
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
