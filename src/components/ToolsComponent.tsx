"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpFromLineIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileQuestionIcon,
  PhoneIcon,
  PhoneOffIcon,
  RotateCwIcon,
  SendHorizontalIcon,
  XIcon,
} from "lucide-react";
import { IoSparklesSharp } from "react-icons/io5";
import { FaMicrophoneAlt } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StreamingResponse } from "@/components/elevenlabs/AIResponse";
import { LiveWaveform } from "@/components/elevenlabs/LiveWaveForm";
import { useVapi, type TranscriptMessage } from "@/hooks/use-vapi";

function downloadTranscriptAsTxt(transcript: TranscriptMessage[]): void {
  if (transcript.length === 0) return;
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("-");
  const filename = `POILE-${timestamp}-transcript.txt`;
  const lines = transcript.map(
    (msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}`,
  );
  const content = lines.join("\n\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTIONS = [
  "What is Pearl of the Orient International Auxiliary Chaplain Values Educators Inc. and what is their mission?",
  "How can I contact the organization? What's their phone number and address?",
  "What services do you offer? Can you help with funeral services or marriage ceremonies?",
  "I want to become a chaplain. What are the requirements and phases I need to complete?",
  "What government accreditations does the organization have? Are you recognized by DILG?",
  "What training programs are available? How long does the School of Chaplaincy take?",
  "What legal mandates govern your chaplaincy ministry?",
];

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hello, you've reached Pearl of the Orient! My name is Pearl. How may I assist you today?",
};

export const ToolsComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState("");
  const [hasReplied, setHasReplied] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantMode, setAssistantMode] = useState<"chat" | "voice">("chat");
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const chatContentRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    const el = chatScrollContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const {
    isConnected: isVoiceCallActive,
    isConnecting: isVoiceConnecting,
    isSpeaking,
    transcript: voiceTranscript,
    error: vapiError,
    startCall: vapiStartCall,
    endCall: vapiEndCall,
  } = useVapi();

  const [micError, setMicError] = useState<string | null>(null);

  const voiceStatus: "idle" | "listening" | "speaking" =
    !isVoiceCallActive ? "idle" : isSpeaking ? "speaking" : "listening";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (assistantMode === "chat" && messengerOpen) scrollChatToBottom();
  }, [messages, isLoading, assistantMode, messengerOpen]);

  useEffect(() => {
    const content = chatContentRef.current;
    const container = chatScrollContainerRef.current;
    if (!content || !container) return;
    const observer = new ResizeObserver(() => scrollChatToBottom());
    observer.observe(content);
    return () => observer.disconnect();
  }, [messages]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetChat = () => {
    setMessages([INITIAL_GREETING]);
    setInputValue("");
    setHasReplied(false);
    setChatId(null);
    setError(null);
  };

  const requestMicAndStartCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicError(null);
      vapiStartCall();
    } catch (err) {
      console.error("Microphone access denied:", err);
      const isSecure =
        typeof window !== "undefined" &&
        (window.isSecureContext ?? window.location?.protocol === "https:");
      setMicError(
        isSecure
          ? "Microphone access is required for voice. Please allow microphone permission in your browser and try again."
          : "Microphone only works on secure pages (HTTPS or localhost). From a phone, open this site over HTTPS (e.g. run the dev server with HTTPS and use https://YOUR_IP:3000).",
      );
    }
  };

  const startVoiceCall = () => {
    setMicError(null);
    requestMicAndStartCall();
  };

  const endVoiceCall = () => {
    if (voiceTranscript.length > 0) {
      downloadTranscriptAsTxt(voiceTranscript);
    }
    vapiEndCall();
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setHasReplied(true);
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: trimmed,
          ...(chatId && { previousChatId: chatId }),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const message =
          typeof data?.error === "string"
            ? data.error
            : "Something went wrong. Please try again.";
        setError(message);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: message,
          },
        ]);
        return;
      }

      setChatId(data.chatId ?? null);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            data.response ??
            "I couldn't generate a response. Please try again.",
        },
      ]);
    } catch {
      setError("Failed to send. Please check your connection and try again.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Failed to send. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="fixed top-1/2 right-0 z-40">
      {/* TODO: Refactor and simplify the code to a seperate component. */}
      {isScrolled && (
        <Card className="p-0! rounded-r-none border-r-none shadow-r-none">
          <CardContent className="p-0!">
            <div className="space-y-2 p-1">
              <Popover
                open={messengerOpen}
                onOpenChange={(open) => {
                  setMessengerOpen(open);
                  if (!open) {
                    setAssistantMode("chat");
                    endVoiceCall();
                    setMicError(null);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-none w-full text-[11px] h-12 flex flex-col"
                  >
                    <MdOutlineSupportAgent className="size-5" />
                    Messenger
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="left"
                  align="center"
                  sideOffset={-80}
                  className="w-110 p-0 flex flex-col h-[90vh] rounded-xl shadow-lg border border-border/80"
                >
                  {assistantMode === "voice" ? (
                    /* Voice Assistant UI */
                    <>
                      <div className="flex items-center gap-2 border-b bg-[#032a0d] px-3 py-2.5 rounded-t-xl text-white">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-white hover:bg-white/20 hover:text-white"
                          onClick={() => {
                            endVoiceCall();
                            setMicError(null);
                            setAssistantMode("chat");
                          }}
                          aria-label="Back to chat"
                        >
                          <ChevronLeftIcon className="size-4" />
                        </Button>
                        <span className="font-semibold">Voice Assistant</span>
                      </div>

                      <div className="flex-1 flex flex-col min-h-0 p-4 gap-4">
                        {(vapiError || micError) && (
                          <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {vapiError ?? micError}
                          </div>
                        )}
                        {isVoiceCallActive ? (
                          <>
                            <div className="flex-1 min-h-0 rounded-xl border border-[#032a0d]/15 bg-muted/30 p-3 overflow-y-auto space-y-3">
                              {voiceTranscript.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  Listening…
                                </p>
                              ) : (
                                voiceTranscript.map((msg, i) => (
                                  <div
                                    key={i}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div
                                      className={`rounded-xl px-3 py-2 text-sm max-w-[90%] ${
                                        msg.role === "user"
                                          ? "bg-[#032a0d] text-white"
                                          : "bg-muted/60 text-foreground"
                                      }`}
                                    >
                                      {msg.role === "user" ? (
                                        msg.text
                                      ) : (
                                        <StreamingResponse
                                          content={msg.text}
                                          delayMs={18}
                                          className="text-foreground **:text-inherit"
                                        />
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="h-14 w-full rounded-xl overflow-hidden border border-[#032a0d]/15 bg-muted/20">
                              <LiveWaveform
                                active={true}
                                processing={false}
                                mode="scrolling"
                                height={56}
                                barColor="rgb(3, 42, 13)"
                                className="w-full"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center gap-4">
                            <div className="flex size-20 items-center justify-center rounded-full border-2 border-[#032a0d]/30 bg-muted/40">
                              <FaMicrophoneAlt className="size-8 text-[#032a0d]/70" />
                            </div>
                            <p className="text-sm text-muted-foreground text-center">
                              Transcript will appear here
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="px-3 pb-4 pt-1 border-t bg-muted/20 rounded-b-xl">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span
                            className={`size-2 rounded-full shrink-0 ${
                              voiceStatus === "speaking"
                                ? "bg-[#032a0d] animate-pulse"
                                : voiceStatus === "listening"
                                  ? "bg-amber-500 animate-pulse"
                                  : "bg-muted-foreground/50"
                            }`}
                          />
                          {voiceStatus === "idle" && "Ready"}
                          {voiceStatus === "listening" && "Listening…"}
                          {voiceStatus === "speaking" && "Assistant Speaking…"}
                        </div>
                        {isVoiceCallActive ? (
                          <Button
                            type="button"
                            variant="destructive"
                            className="w-full rounded-xl py-6 text-white font-medium"
                            onClick={endVoiceCall}
                          >
                            <PhoneOffIcon className="size-4 mr-2" />
                            End call
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isVoiceConnecting}
                            className="w-full rounded-xl py-6 bg-[#032a0d] hover:bg-[#032a0d]/90 text-white font-medium disabled:opacity-70"
                            onClick={startVoiceCall}
                          >
                            <PhoneIcon className="size-4 mr-2" />
                            {isVoiceConnecting ? "Connecting…" : "Start call"}
                          </Button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                  {/* Chat header */}
                  <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2.5 rounded-t-xl">
                    <div className="flex items-center gap-2">
                      <IoSparklesSharp className="size-4 text-[#032a0d]" />
                      <span className="font-semibold text-foreground">
                        Pearl Assistant
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setAssistantMode("voice")}
                            aria-label="Switch to voice assistant"
                          >
                            <FaMicrophoneAlt className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Voice assistant
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-muted-foreground hover:text-foreground"
                            onClick={resetChat}
                            aria-label="Restart conversation"
                          >
                            <RotateCwIcon className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          Restart conversation
                        </TooltipContent>
                      </Tooltip>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setMessengerOpen(false)}
                        aria-label="Close"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div
                    ref={chatScrollContainerRef}
                    className="flex-1 overflow-y-auto min-h-80 max-h-full scroll-smooth p-3"
                  >
                    <div ref={chatContentRef} className="space-y-3">
                    <p className="text-center text-xs text-muted-foreground py-1">
                      Today
                    </p>

                    <div className="rounded-xl bg-muted/60 px-3 py-2.5 text-sm text-foreground">
                      {INITIAL_GREETING.content}
                    </div>

                    {!hasReplied && (
                      <>
                        <div className="rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                          Ask me a question or choose a suggestion:
                        </div>
                        <div className="space-y-2">
                          {SUGGESTIONS.map((suggestion, i) => (
                            <button
                              key={i}
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="w-full flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2.5 text-left text-sm text-foreground hover:bg-muted/70 transition-colors disabled:opacity-60 disabled:pointer-events-none"
                            >
                              <ChevronRightIcon className="size-4 shrink-0 text-[#032a0d]" />
                              <span className="line-clamp-2">{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {messages
                      .filter((m) => m.id !== "greeting")
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`rounded-xl px-3 py-2 text-sm max-w-[90%] ${
                              msg.role === "user"
                                ? "bg-[#032a0d] text-white"
                                : "bg-muted/60 text-foreground"
                            }`}
                          >
                            {msg.role === "user" ? (
                              msg.content
                            ) : (
                              <StreamingResponse
                                content={msg.content}
                                delayMs={18}
                                className="text-foreground **:text-inherit"
                              />
                            )}
                          </div>
                        </div>
                      ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-xl bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                          Pearl is typing…
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground pt-2 leading-relaxed">
                      AI answers are for general guidance only. Pearl Assistant
                      is constantly learning. Do not share personal or sensitive
                      information in this chat.
                    </p>
                    </div>
                  </div>

                  {/* Input footer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 p-2 border-t bg-muted/20 rounded-b-xl"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me a question"
                      className="flex-1 text-sm rounded-lg border bg-background"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isLoading}
                      className="shrink-0 size-9 rounded-lg bg-[#032a0d] hover:bg-[#032a0d]/90 text-white"
                      aria-label="Send"
                    >
                      <SendHorizontalIcon className="size-4" />
                    </Button>
                  </form>
                    </>
                  )}
                </PopoverContent>
              </Popover>
              <Separator />
              <Link href="/survey" target="_blank">
                <Button
                  variant="ghost"
                  className="rounded-none w-full text-[11px] h-12 flex flex-col"
                >
                  <FileQuestionIcon className="size-4" />
                  Survey
                </Button>
              </Link>
              <Separator />
              <Button
                variant="ghost"
                className="rounded-none w-full text-[11px] h-12 flex flex-col"
                onClick={scrollToTop}
              >
                <ArrowUpFromLineIcon className="size-4" />
                Back to Top
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
