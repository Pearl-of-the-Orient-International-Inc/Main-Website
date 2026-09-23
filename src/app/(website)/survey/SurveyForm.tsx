"use client";

import { CheckCircle2, FileQuestion, RotateCcw, Send, Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitSurveyFeedbackMutation } from "@/features/survey-feedback/survey-feedback.hooks";
import { toApiError } from "@/lib/http-client";

const improvementOptions = [
  "Chaplain services",
  "Training and seminars",
  "Membership support",
  "Website experience",
  "Communication and announcements",
];

const initialForm = {
  name: "",
  respondentType: "",
  discoverySource: "",
  improvements: [] as string[],
  ratings: {
    welcome: 0,
    accessibility: 0,
    satisfaction: 0,
  },
  feedback: "",
  hasIssue: null as boolean | null,
  issueCategory: "",
  issueDescription: "",
  contactEmail: "",
};

export function SurveyForm() {
  const submitMutation = useSubmitSurveyFeedbackMutation();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const answeredCount = [
    Boolean(form.respondentType),
    Boolean(form.discoverySource),
    form.improvements.length > 0,
    form.ratings.welcome > 0,
    form.ratings.accessibility > 0,
    form.ratings.satisfaction > 0,
    Boolean(form.feedback.trim()),
    form.hasIssue !== null,
    ...(form.hasIssue ? [Boolean(form.issueCategory), Boolean(form.issueDescription.trim())] : []),
  ].filter(Boolean).length;
  const requiredQuestionCount = form.hasIssue ? 10 : 8;
  const averageRating = Object.values(form.ratings).reduce((total, rating) => total + rating, 0) / Object.keys(form.ratings).length;

  const toggleImprovement = (option: string, checked: boolean) => {
    setForm((current) => ({
      ...current,
      improvements: checked
        ? [...current.improvements, option]
        : current.improvements.filter((item) => item !== option),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answeredCount !== requiredQuestionCount) {
      setError("Please answer all required questions before submitting.");
      return;
    }
    if (form.contactEmail.trim() && !/^\S+@\S+\.\S+$/.test(form.contactEmail.trim())) {
      setError("Enter a valid contact email or leave it blank.");
      return;
    }
    setError("");
    try {
      await submitMutation.mutateAsync({
        respondentName: form.name.trim() || null,
        respondentType: form.respondentType as "Visitor" | "Member" | "Student" | "Service requester",
        discoverySource: form.discoverySource as "Social media" | "Friend or family" | "Community announcement" | "Online search" | "Organization member" | "Other",
        improvementAreas: form.improvements,
        welcomeRating: form.ratings.welcome,
        accessibilityRating: form.ratings.accessibility,
        satisfactionRating: form.ratings.satisfaction,
        feedback: form.feedback.trim(),
        hasIssue: form.hasIssue === true,
        issueCategory: form.hasIssue ? form.issueCategory : null,
        issueDescription: form.hasIssue ? form.issueDescription.trim() : null,
        contactEmail: form.hasIssue ? form.contactEmail.trim() || null : null,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(toApiError(submissionError).message ?? "Unable to submit your response. Please try again.");
    }
  };

  const reset = () => {
    setForm(initialForm);
    setSubmitted(false);
    setError("");
  };

  if (submitted) {
    return (
      <main className="min-h-[55vh] bg-neutral-50 px-4 py-12 sm:px-6">
        <Card className="mx-auto max-w-3xl text-center">
          <CardContent className="py-12">
            <CheckCircle2 className="mx-auto size-14 text-[#032a0d]" />
            <h2 className="mt-5 font-serif text-3xl text-[#032a0d]">Thank you for your feedback</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600">
              Your response has been recorded and is now available to authorized administrators for review.
            </p>
            <Button className="mt-6 bg-[#032a0d] hover:bg-[#043b13]" onClick={reset}>
              <RotateCcw className="size-4" /> Answer again
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="bg-neutral-50 px-4 py-10 sm:px-6 sm:py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
        <Card className="overflow-hidden pt-0">
          <CardHeader className="border-b bg-[#f7faf7] pt-6">
            <CardTitle className="flex items-center gap-2 text-xl text-[#032a0d]"><FileQuestion className="size-5" />General Experience</CardTitle>
            <CardDescription>Required questions are marked with an asterisk (*).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="rounded-lg border border-[#032a0d]/10 bg-[#f7faf7] p-4">
              <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-[#032a0d]">Survey progress</span><span className="text-neutral-500">{answeredCount}/{requiredQuestionCount} required questions answered</span></div>
              <Progress value={(answeredCount / requiredQuestionCount) * 100} className="mt-3" />
            </div>
            <Question number={1} title="Your name" description="Optional — you may leave this blank to answer anonymously.">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} maxLength={150} placeholder="Enter your name" />
            </Question>

            <Question number={2} title="Which best describes you? *" description="Select one answer.">
              <RadioGroup value={form.respondentType} onValueChange={(value) => setForm({ ...form, respondentType: value })} className="grid gap-3 sm:grid-cols-2">
                {["Visitor", "Member", "Student", "Service requester"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:border-[#032a0d]/40"><RadioGroupItem value={option} /><span className="text-sm font-medium">{option}</span></label>)}
              </RadioGroup>
            </Question>

            <Question number={3} title="How did you first hear about us? *" description="Select one answer.">
              <RadioGroup value={form.discoverySource} onValueChange={(value) => setForm({ ...form, discoverySource: value })} className="grid gap-3 sm:grid-cols-2">
                {["Social media", "Friend or family", "Community announcement", "Online search", "Organization member", "Other"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:border-[#032a0d]/40"><RadioGroupItem value={option} /><span className="text-sm font-medium">{option}</span></label>)}
              </RadioGroup>
            </Question>

            <Question number={4} title="Which areas should we improve? *" description="Select one or more answers.">
              <div className="grid gap-3 sm:grid-cols-2">
                {improvementOptions.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:border-[#032a0d]/40"><Checkbox checked={form.improvements.includes(option)} onCheckedChange={(checked) => toggleImprovement(option, checked === true)} /><span className="text-sm font-medium">{option}</span></label>)}
              </div>
            </Question>

            <div className="space-y-5 rounded-xl border border-[#032a0d]/10 bg-[#f7faf7] p-5">
              <div><h3 className="font-serif text-2xl text-[#032a0d]">Satisfaction Rating</h3><p className="mt-1 text-sm text-neutral-600">1 — Strongly disagree · 2 — Disagree · 3 — Neutral · 4 — Agree · 5 — Strongly agree</p></div>
              <RatingQuestion number={5} title="I felt welcomed and treated with care." value={form.ratings.welcome} onChange={(rating) => setForm({ ...form, ratings: { ...form.ratings, welcome: rating } })} />
              <RatingQuestion number={6} title="The organization’s services and information are easy to access." value={form.ratings.accessibility} onChange={(rating) => setForm({ ...form, ratings: { ...form.ratings, accessibility: rating } })} />
              <RatingQuestion number={7} title="Overall, I am satisfied with my experience." value={form.ratings.satisfaction} onChange={(rating) => setForm({ ...form, ratings: { ...form.ratings, satisfaction: rating } })} />
              <div className="rounded-lg bg-white p-4 text-center text-sm font-medium text-[#032a0d]">Average satisfaction score: {averageRating.toFixed(2)} / 5</div>
            </div>

            <Question number={8} title="Please tell us more about your experience. *" description="Share suggestions, concerns, or services you would like us to offer.">
              <Textarea value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} maxLength={3000} rows={7} placeholder="Write your feedback here..." />
              <p className="mt-2 text-right text-xs text-neutral-500">{form.feedback.length}/3000</p>
            </Question>

            <Question number={9} title="Did you experience an issue that you want to report? *" description="Issue reports are included with your survey response for administrator review.">
              <RadioGroup value={form.hasIssue === null ? "" : form.hasIssue ? "Yes" : "No"} onValueChange={(value) => setForm({ ...form, hasIssue: value === "Yes", issueCategory: value === "Yes" ? form.issueCategory : "", issueDescription: value === "Yes" ? form.issueDescription : "", contactEmail: value === "Yes" ? form.contactEmail : "" })} className="grid gap-3 sm:grid-cols-2">
                {["No", "Yes"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors hover:border-[#032a0d]/40"><RadioGroupItem value={option} /><span className="text-sm font-medium">{option === "Yes" ? "Yes, I want to report an issue" : "No issue to report"}</span></label>)}
              </RadioGroup>
            </Question>

            {form.hasIssue ? <div className="space-y-5 rounded-xl border border-amber-200 bg-amber-50/60 p-5"><div><h3 className="font-semibold text-neutral-950">Issue report details</h3><p className="mt-1 text-sm text-neutral-600">Provide enough information for the administration to understand the problem.</p></div><Question number={10} title="Issue category *" description="Select the category closest to your concern."><RadioGroup value={form.issueCategory} onValueChange={(value) => setForm({ ...form, issueCategory: value })} className="grid gap-3 sm:grid-cols-2">{["Website or technical problem", "Chaplain service concern", "Membership concern", "Payment concern", "Safety or conduct concern", "Other"].map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-4"><RadioGroupItem value={option} /><span className="text-sm font-medium">{option}</span></label>)}</RadioGroup></Question><Question number={11} title="Describe the issue *" description="Include what happened and any relevant details."><Textarea value={form.issueDescription} onChange={(event) => setForm({ ...form, issueDescription: event.target.value })} maxLength={3000} rows={5} placeholder="Describe the issue..." /></Question><Question number={12} title="Contact email" description="Optional — provide an email if you want the administration to follow up."><Input type="email" value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} maxLength={320} placeholder="name@example.com" /></Question></div> : null}
          </CardContent>
        </Card>

        {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={reset}><RotateCcw className="size-4" />Clear answers</Button>
          <Button type="submit" disabled={submitMutation.isPending} className="bg-[#032a0d] hover:bg-[#043b13]"><Send className="size-4" />{submitMutation.isPending ? "Submitting..." : "Submit feedback"}</Button>
        </div>
      </form>
    </main>
  );
}

function Question({ number, title, description, children }: { number: number; title: string; description: string; children: React.ReactNode }) {
  return <fieldset className="space-y-3"><legend className="text-base font-semibold text-neutral-950"><span className="mr-2 text-[#032a0d]">{number}.</span>{title}</legend><p className="text-sm text-neutral-500">{description}</p><div>{children}</div></fieldset>;
}

function RatingQuestion({ number, title, value, onChange }: { number: number; title: string; value: number; onChange: (rating: number) => void }) {
  return <fieldset className="space-y-3 rounded-lg bg-white p-4"><legend className="font-medium text-neutral-900"><span className="mr-2 text-[#032a0d]">{number}.</span>{title} *</legend><div className="flex flex-wrap gap-2" role="radiogroup" aria-label={title}>{[1, 2, 3, 4, 5].map((rating) => <button key={rating} type="button" role="radio" aria-checked={value === rating} onClick={() => onChange(rating)} className={`flex min-w-16 flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-3 transition-colors ${value === rating ? "border-[#032a0d] bg-[#032a0d] text-white" : "bg-white text-neutral-700 hover:border-[#032a0d]/50"}`}><Star className={`size-4 ${value >= rating ? "fill-amber-400 text-amber-400" : "text-neutral-400"}`} /><span>{rating}</span></button>)}</div></fieldset>;
}
