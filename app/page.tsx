"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// ==========================================
// Dynamic Tag Color Palette (สุ่มสีพาสเทลสดใสให้แต่ละแท็ก)
// ==========================================
const TAG_COLORS = [
  {
    bg: "bg-emerald-50 hover:bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    bg: "bg-violet-50 hover:bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  {
    bg: "bg-amber-50 hover:bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  {
    bg: "bg-rose-50 hover:bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
  },
  {
    bg: "bg-cyan-50 hover:bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  {
    bg: "bg-fuchsia-50 hover:bg-fuchsia-100",
    text: "text-fuchsia-700",
    border: "border-fuchsia-200",
  },
  {
    bg: "bg-indigo-50 hover:bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
];

function getTagStyle(id: number) {
  return TAG_COLORS[id % TAG_COLORS.length];
}

// ==========================================
// 1. Institutional Notification Alert Modal Component
// ==========================================
function AlertDialog({
  isOpen,
  title = "แจ้งเตือนระบบ",
  message,
  type = "warning",
  onClose,
}: {
  isOpen: boolean;
  title?: string;
  message: string;
  type?: "warning" | "error" | "success" | "info";
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          {type === "warning" && (
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          )}
          {type === "error" && (
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          {type === "success" && (
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {type === "info" && (
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-2xs active:scale-98"
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Institutional Confirmation Modal Component (มาแทน confirm() ของ browser)
// ==========================================
function ConfirmDialog({
  isOpen,
  title = "ยืนยันการทำรายการ",
  message,
  confirmText = "ยืนยันลบ",
  cancelText = "ยกเลิก",
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">
              {message}
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-all border border-slate-200 active:scale-98"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-xs active:scale-98"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Component แสดงผล Code Snippet (VS Code Style)
// ==========================================
function CodeViewer({
  code,
  filename = "snippet.txt",
}: {
  code: string;
  filename?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const lines = code.trim().split("\n");

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-5 border border-slate-800 bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-xl font-mono text-xs">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 bg-[#252526] text-slate-300 cursor-pointer hover:bg-[#2d2d2d] transition-all border-b border-slate-800"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-amber-400 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            {filename}
          </span>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
            {lines.length} lines
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isOpen && (
            <button
              onClick={handleCopy}
              className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-sans px-3 py-1 rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  คัดลอกเรียบร้อย
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  คัดลอกโค้ด
                </>
              )}
            </button>
          )}
          <span className="text-slate-400 font-bold text-xs flex items-center gap-1">
            {isOpen ? "ซ่อน" : "แสดงโค้ด"}
            <svg
              className={`w-3.5 h-3.5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 overflow-x-auto text-slate-200 flex leading-relaxed">
          <div className="select-none text-right pr-4 text-slate-600 border-r border-slate-800 font-mono">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="pl-4 font-mono whitespace-pre text-slate-100 flex-1">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. Main App Component
// ==========================================
export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [courses, setCourses] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [topicTags, setTopicTags] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("2/2569");
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom Alert Modal State
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    type?: "warning" | "error" | "success" | "info";
  }>({
    isOpen: false,
    message: "",
  });

  const showAlert = (
    message: string,
    title = "แจ้งเตือนระบบ",
    type: "warning" | "error" | "success" | "info" = "warning"
  ) => {
    setAlertState({ isOpen: true, title, message, type });
  };

  // Custom Confirm Modal State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: "",
    onConfirm: () => {},
  });

  const showConfirm = (
    message: string,
    onConfirm: () => void,
    title = "ยืนยันการลบข้อมูล"
  ) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"upvotes" | "newest">("upvotes");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // AI Semantic Duplicate Check
  const [similarPosts, setSimilarPosts] = useState<any[]>([]);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);

  // Form States
  const [joinCode, setJoinCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCodeSnippet, setNewCodeSnippet] = useState("");
  const [newPostTagId, setNewPostTagId] = useState<string>("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAnswer, setNewAnswer] = useState("");

  // Nested Replies States
  const [replyToAnswerId, setReplyToAnswerId] = useState<string | null>(null);
  const [nestedReplyContent, setNestedReplyContent] = useState("");

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  // AI Duplicate Check
  useEffect(() => {
    if (newTitle.trim().length > 3 && selectedCourse) {
      const query = newTitle.toLowerCase();
      const matches = posts.filter(
        (p) =>
          p.course_id === selectedCourse.id &&
          p.semester === selectedSemester &&
          (p.title.toLowerCase().includes(query) ||
            p.content.toLowerCase().includes(query))
      );
      setSimilarPosts(matches.slice(0, 3));
    } else {
      setSimilarPosts([]);
    }
  }, [newTitle, selectedCourse, selectedSemester, posts]);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const userEmail = session.user.email || "";

    if (!userEmail.endsWith("@email.kmutnb.ac.th")) {
      showAlert(
        "ระบบอนุญาตเฉพาะอีเมลสถาบัน @email.kmutnb.ac.th เท่านั้น",
        "การเข้าถึงถูกปฏิเสธ",
        "error"
      );
      await supabase.auth.signOut();
      router.push("/login");
      return;
    }

    const googleName =
      session.user.user_metadata?.full_name || userEmail.split("@")[0];

    const { error: upsertError } = await supabase
      .from("users")
      .upsert([{ id: session.user.id, full_name: googleName.toUpperCase() }], {
        onConflict: "id",
      });

    if (upsertError) console.error("อัปเดตชื่อล้มเหลว:", upsertError);

    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setCurrentUser({ ...session.user, ...userProfile });
    fetchData(session.user.id);
  }

  async function fetchData(userId: string) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id")
      .eq("user_id", userId);
    const courseIds = enrollments?.map((e) => e.course_id) || [];

    if (courseIds.length > 0) {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .in("id", courseIds);
      if (courseData) setCourses(courseData);

      const { data: postData } = await supabase
        .from("posts")
        .select(
          "*, users(full_name), upvotes(user_id), answers(id), topic_tags(id, name)"
        )
        .in("course_id", courseIds)
        .order("created_at", { ascending: false });
      if (postData) setPosts(postData);

      const { data: tagData } = await supabase
        .from("topic_tags")
        .select("*")
        .in("course_id", courseIds);
      if (tagData) setTopicTags(tagData);
    } else {
      setCourses([]);
      setPosts([]);
      setTopicTags([]);
    }

    setLoading(false);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function uploadFileToStorage(file: File, folder: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("post-attachments")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("post-attachments")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleSummarizeWithAI = async () => {
    if (!selectedPost) return;
    setIsSummarizing(true);
    setAiSummary(null);

    setTimeout(() => {
      setAiSummary("DONE");
      setIsSummarizing(false);
    }, 1000);
  };

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!newTagName || !selectedCourse) return;

    const { error } = await supabase
      .from("topic_tags")
      .insert([{ course_id: selectedCourse.id, name: newTagName }]);

    if (!error) {
      setNewTagName("");
      fetchData(currentUser.id);
    } else {
      showAlert(
        "เกิดข้อผิดพลาดในการสร้างแท็ก: " + error.message,
        "ข้อผิดพลาด",
        "error"
      );
    }
  }

  async function handleDeleteTag(tagId: number) {
    showConfirm("คุณต้องการลบแท็กบทเรียนนี้ใช่หรือไม่?", async () => {
      const { error } = await supabase
        .from("topic_tags")
        .delete()
        .eq("id", tagId);
      if (!error) fetchData(currentUser.id);
    });
  }

  async function handleJoinCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode) return;
    setIsSubmitting(true);

    const { data: course, error } = await supabase
      .from("courses")
      .select("*")
      .eq("join_code", joinCode)
      .single();

    if (error || !course) {
      showAlert(
        "ไม่พบรหัสชั้นเรียนที่ระบุ กรุณาตรวจสอบรหัสอีกครั้ง",
        "ไม่พบชั้นเรียน",
        "error"
      );
    } else {
      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert([{ user_id: currentUser.id, course_id: course.id }]);
      if (enrollError) {
        showAlert(
          "คุณอยู่ในชั้นเรียนนี้อยู่แล้ว หรือเกิดข้อผิดพลาดในการเข้าร่วม",
          "แจ้งเตือน",
          "info"
        );
      } else {
        showAlert(
          `เข้าร่วมวิชา ${course.course_name} เรียบร้อยแล้ว`,
          "สำเร็จ",
          "success"
        );
        setIsJoinModalOpen(false);
        setJoinCode("");
        fetchData(currentUser.id);
      }
    }
    setIsSubmitting(false);
  }

  async function handleTogglePin(
    postId: number,
    currentPinnedStatus: boolean,
    e: React.MouseEvent
  ) {
    e.stopPropagation();
    const { error } = await supabase
      .from("posts")
      .update({ is_pinned: !currentPinnedStatus })
      .eq("id", postId);

    if (!error) fetchData(currentUser.id);
  }

  async function handleVerifyAnswer(
    answerId: string,
    currentVerifiedStatus: boolean
  ) {
    const { error } = await supabase
      .from("answers")
      .update({ is_verified: !currentVerifiedStatus })
      .eq("id", answerId);

    if (!error && selectedPost) fetchAnswers(selectedPost.id);
  }

  async function handleDeletePost(postId: number, e: React.MouseEvent) {
    e.stopPropagation();
    showConfirm(
      "คุณต้องการลบกระทู้นี้ออกจากระบบใช่หรือไม่?",
      async () => {
        const { error } = await supabase
          .from("posts")
          .delete()
          .eq("id", postId);
        if (!error) {
          if (selectedPost?.id === postId) setSelectedPost(null);
          fetchData(currentUser.id);
        } else {
          showAlert(
            "ไม่สามารถลบกระทู้ได้: " + error.message,
            "ข้อผิดพลาด",
            "error"
          );
        }
      },
      "ลบกระทู้คำถาม"
    );
  }

  async function handleDeleteAnswer(answerId: string) {
    showConfirm(
      "คุณต้องการลบคำตอบนี้ใช่หรือไม่?",
      async () => {
        const { error } = await supabase
          .from("answers")
          .delete()
          .eq("id", answerId);
        if (!error && selectedPost) {
          fetchAnswers(selectedPost.id);
          fetchData(currentUser.id);
        } else if (error) {
          showAlert(
            "ไม่สามารถลบคำตอบได้: " + error.message,
            "ข้อผิดพลาด",
            "error"
          );
        }
      },
      "ลบคำตอบ"
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  async function fetchAnswers(postId: number) {
    const { data } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setAnswers(data);
  }

  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
    setAnswers([]);
    setShowReplyForm(false);
    setNewAnswer("");
    setAiSummary(null);
    setReplyToAnswerId(null);
    fetchAnswers(post.id);
  };

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = null;
    let fileUrl = null;

    if (selectedImage)
      imageUrl = await uploadFileToStorage(selectedImage, "images");
    if (selectedFile) fileUrl = await uploadFileToStorage(selectedFile, "docs");

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: newTitle,
          content: newContent,
          code_snippet: newCodeSnippet.trim() || null,
          image_url: imageUrl,
          file_url: fileUrl,
          course_id: selectedCourse.id,
          topic_tag_id: newPostTagId ? parseInt(newPostTagId) : null,
          semester: selectedSemester,
          user_id: currentUser.id,
        },
      ])
      .select(
        "*, users(full_name), upvotes(user_id), answers(id), topic_tags(id, name)"
      );

    if (!error && data) {
      setPosts([data[0], ...posts]);
      setNewTitle("");
      setNewContent("");
      setNewCodeSnippet("");
      setNewPostTagId("");
      setSelectedImage(null);
      setImagePreview(null);
      setSelectedFile(null);
      setSimilarPosts([]);
      setIsModalOpen(false);
    } else if (error) {
      showAlert(
        "เกิดข้อผิดพลาดในการตั้งกระทู้: " + error.message,
        "ข้อผิดพลาด",
        "error"
      );
    }
    setIsSubmitting(false);
  }

  async function handleSubmitAnswer(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("answers")
      .insert([
        {
          content: newAnswer,
          post_id: selectedPost.id,
          user_id: currentUser.id,
        },
      ])
      .select("*, users(full_name)");
    if (!error && data) {
      setAnswers([...answers, data[0]]);
      setNewAnswer("");
      setShowReplyForm(false);
      fetchData(currentUser.id);
    }
    setIsSubmitting(false);
  }

  async function handleCreateNestedReply(parentId: string) {
    if (!nestedReplyContent.trim()) return;
    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("answers")
      .insert([
        {
          content: nestedReplyContent,
          post_id: selectedPost.id,
          user_id: currentUser.id,
          parent_id: parentId,
        },
      ])
      .select("*, users(full_name)");

    if (!error && data) {
      setAnswers([...answers, data[0]]);
      setNestedReplyContent("");
      setReplyToAnswerId(null);
    } else if (error) {
      showAlert(
        "เกิดข้อผิดพลาดในการตอบกลับ: " + error.message,
        "ข้อผิดพลาด",
        "error"
      );
    }
    setIsSubmitting(false);
  }

  const handleToggleUpvote = async (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const postIndex = posts.findIndex((p) => p.id === postId);
    const post = posts[postIndex];
    const hasVoted = post.upvotes?.some(
      (vote: any) => vote.user_id === currentUser.id
    );

    const newPosts = [...posts];
    if (!newPosts[postIndex].upvotes) newPosts[postIndex].upvotes = [];
    if (hasVoted)
      newPosts[postIndex].upvotes = post.upvotes.filter(
        (vote: any) => vote.user_id !== currentUser.id
      );
    else newPosts[postIndex].upvotes.push({ user_id: currentUser.id });

    setPosts(newPosts);
    if (selectedPost?.id === postId) setSelectedPost(newPosts[postIndex]);

    if (hasVoted)
      await supabase
        .from("upvotes")
        .delete()
        .match({ post_id: postId, user_id: currentUser.id });
    else
      await supabase
        .from("upvotes")
        .insert([{ post_id: postId, user_id: currentUser.id }]);
  };

  const filteredPosts = posts.filter((post) => {
    const matchCourse = selectedCourse
      ? post.course_id === selectedCourse.id
      : true;
    const matchSemester = post.semester === selectedSemester;
    const matchTag = selectedTag ? post.topic_tag_id === selectedTag : true;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCourse && matchSemester && matchTag && matchSearch;
  });

  const displayPosts = [...filteredPosts].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    if (sortBy === "upvotes") {
      const votesA = a.upvotes?.length || 0;
      const votesB = b.upvotes?.length || 0;
      if (votesA !== votesB) return votesB - votesA;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const isInstructorOrAdmin =
    currentUser?.role?.toLowerCase() === "teacher" ||
    currentUser?.role?.toLowerCase() === "admin";

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs tracking-wide">
            กำลังเชื่อมต่อ Course FAQ System...
          </span>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800">
      {/* Custom Alert Notification Dialog */}
      <AlertDialog
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
      />

      {/* Custom Confirmation Modal Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Top Bar Header - Enterprise Light Theme */}
      <header className="bg-white border-b border-slate-200 text-slate-800 px-6 py-3 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-xs tracking-wider">
            QA
          </div>
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-base text-slate-900 tracking-tight">
              Course FAQ System
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs transition-colors">
            <svg
              className="w-3.5 h-3.5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            <span className="text-slate-500 font-medium">ภาคการศึกษา:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="2/2569" className="text-slate-800">
                2/2569
              </option>
              <option value="1/2569" className="text-slate-800">
                1/2569
              </option>
              <option value="2/2568" className="text-slate-800">
                2/2568
              </option>
            </select>
          </div>

          {currentUser?.role?.toLowerCase() === "teacher" && (
            <button
              onClick={() => router.push("/teacher")}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-lg transition-all shadow-2xs flex items-center gap-2 active:scale-97"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Instructor Dashboard
            </button>
          )}

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white">
              {currentUser?.full_name?.charAt(0) || "U"}
            </div>
            <span className="text-xs font-semibold text-slate-700 max-w-[130px] truncate">
              {currentUser?.full_name || currentUser?.email}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 my-auto"></div>

          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 px-2.5 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            ออกระบบ
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-72 border-r border-slate-200/80 bg-white flex flex-col p-5 shadow-sm z-10">
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl mb-2.5 text-xs transition-all border border-slate-200 shadow-2xs flex items-center justify-center gap-2 active:scale-98"
          >
            <svg
              className="w-4 h-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            เข้าร่วมชั้นเรียน (Join Class)
          </button>

          <button
            onClick={() => {
              if (!selectedCourse) {
                showAlert(
                  "กรุณาเลือกรายวิชาที่ต้องการทางซ้ายมือก่อนทำรายการตั้งกระทู้",
                  "ต้องเลือกรายวิชา",
                  "warning"
                );
              } else {
                setIsModalOpen(true);
              }
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl mb-6 text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-98"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20 4.828a2 2 0 010 2.828l-8.485 8.485M7 17h.01"
              />
            </svg>
            ตั้งกระทู้ถามใหม่
          </button>

          {/* Courses List */}
          <div className="text-[11px] font-extrabold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              รายวิชาของคุณ
            </span>
            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 text-[10px]">
              {courses.length}
            </span>
          </div>

          {courses.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ยังไม่มีวิชาเรียน
            </div>
          ) : (
            <ul className="text-xs space-y-2 mb-6">
              {courses.map((course) => {
                const isSelected = selectedCourse?.id === course.id;

                return (
                  <li
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedTag(null);
                      setSelectedPost(null);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border-l-4 relative overflow-hidden ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-600 shadow-md shadow-blue-500/5 ring-1 ring-blue-100"
                        : "bg-slate-50/60 hover:bg-blue-50/40 border-transparent hover:border-blue-400 text-slate-600"
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                        <svg
                          className="w-3.5 h-3.5 text-blue-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                        <span>{course.course_code}</span>
                      </div>
                      <div className="text-sm font-extrabold text-blue-950 truncate leading-snug">
                        {course.course_name}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Topic Tags Sidebar Filter */}
          {selectedCourse && (
            <div className="pt-4 border-t border-slate-100 flex-1 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  แท็กบทเรียน
                </span>
                {isInstructorOrAdmin && (
                  <button
                    onClick={() => setIsManageTagsModalOpen(true)}
                    className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-lg border border-blue-200 transition-colors"
                  >
                    + จัดการ
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`text-xs px-3 py-1 rounded-xl transition-all font-medium ${
                    selectedTag === null
                      ? "bg-slate-900 text-white shadow-xs font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  ทั้งหมด
                </button>
                {topicTags
                  .filter((t) => t.course_id === selectedCourse.id)
                  .map((tag) => {
                    const tagStyle = getTagStyle(tag.id);
                    const isSelected = selectedTag === tag.id;

                    return (
                      <button
                        key={tag.id}
                        onClick={() => setSelectedTag(tag.id)}
                        className={`text-xs px-3 py-1 rounded-xl transition-all border font-semibold ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : `${tagStyle.bg} ${tagStyle.text} ${tagStyle.border}`
                        }`}
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </aside>

        {/* Middle Posts List Feed */}
        <section className="w-[420px] border-r border-slate-200/80 flex flex-col bg-slate-50/50">
          <div className="p-4 bg-white border-b border-slate-200 space-y-3 z-0 shadow-2xs">
            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหากระทู้ในเทอมนี้..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100/70 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] font-semibold text-slate-400">
                เรียงลำดับ:
              </span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-[11px]">
                <button
                  onClick={() => setSortBy("upvotes")}
                  className={`px-3 py-1 rounded-lg transition-all font-semibold flex items-center gap-1 ${
                    sortBy === "upvotes"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  คะแนนโหวต
                </button>
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-1 rounded-lg transition-all font-semibold flex items-center gap-1 ${
                    sortBy === "newest"
                      ? "bg-white text-blue-700 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ล่าสุด
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            <div className="text-[11px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
                กระทู้ทั้งหมด ({displayPosts.length})
              </span>
            </div>

            {displayPosts.length === 0 ? (
              <div className="text-xs text-slate-400 text-center mt-12 bg-white py-10 rounded-2xl border border-dashed border-slate-200 p-4">
                <svg
                  className="w-8 h-8 text-slate-300 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                ไม่พบกระทู้ที่ตรงตามเงื่อนไขการค้นหา
              </div>
            ) : (
              displayPosts.map((post) => {
                const hasVoted = post.upvotes?.some(
                  (v: any) => v.user_id === currentUser.id
                );
                const answerCount = post.answers?.length || 0;
                const tagStyle = post.topic_tags
                  ? getTagStyle(post.topic_tags.id)
                  : null;

                return (
                  <div
                    key={post.id}
                    onClick={() => handleSelectPost(post)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPost?.id === post.id
                        ? "border-blue-500 bg-white shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`flex flex-col items-center justify-center px-2 py-1.5 rounded-xl border transition-all h-fit ${
                          hasVoted
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-blue-50/50"
                        }`}
                        onClick={(e) => handleToggleUpvote(post.id, e)}
                      >
                        <button className="text-sm leading-none transition-transform hover:scale-125">
                          ▲
                        </button>
                        <span className="text-xs font-black mt-0.5">
                          {post.upvotes?.length || 0}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {post.is_pinned && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                              <svg
                                className="w-2.5 h-2.5 text-amber-800"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M5 5h14l-1 7H6L5 5zM12 12v9M9 5V3h6v2" />
                              </svg>
                              ปักหมุด
                            </span>
                          )}
                          {post.topic_tags?.name && tagStyle && (
                            <span
                              className={`${tagStyle.bg} ${tagStyle.text} ${tagStyle.border} text-[10px] font-bold px-2 py-0.5 rounded-md border`}
                            >
                              #{post.topic_tags.name}
                            </span>
                          )}
                          <h4
                            className={`font-bold text-xs leading-snug w-full mt-1 line-clamp-2 ${
                              selectedPost?.id === post.id
                                ? "text-blue-950"
                                : "text-slate-800"
                            }`}
                          >
                            {post.title}
                          </h4>
                        </div>

                        {/* แถบสถิติด้านล่างและปุ่ม Action ด้วย SVG Vector Icons */}
                        <div className="flex items-center justify-between text-slate-400 mt-3 pt-2 border-t border-slate-100/80">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold text-[11px] truncate">
                              <svg
                                className="w-3 h-3 text-slate-500 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="truncate max-w-[100px]">
                                {post.users?.full_name || "Anonymous"}
                              </span>
                            </span>

                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100 text-[11px] shrink-0">
                              <svg
                                className="w-3 h-3 text-blue-600 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {answerCount}
                            </span>
                          </div>

                          {/* Action Micro-Buttons */}
                          {isInstructorOrAdmin && (
                            <div className="flex items-center gap-1 shrink-0 ml-1">
                              <button
                                title={
                                  post.is_pinned ? "ปลดหมุด" : "ปักหมุดกระทู้"
                                }
                                onClick={(e) =>
                                  handleTogglePin(post.id, post.is_pinned, e)
                                }
                                className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                                  post.is_pinned
                                    ? "bg-amber-100 text-amber-800 border-amber-300 shadow-2xs"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                                }`}
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill={
                                    post.is_pinned ? "currentColor" : "none"
                                  }
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 5h14l-1 7H6L5 5zM12 12v9M9 5V3h6v2"
                                  />
                                </svg>
                              </button>

                              <button
                                title="ลบกระทู้"
                                onClick={(e) => handleDeletePost(post.id, e)}
                                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                              >
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Post Detail Content View */}
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          {selectedPost ? (
            <div className="max-w-4xl w-full mx-auto p-8 pb-24">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-8 mb-6">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-md border border-blue-400/30">
                      {selectedPost.users?.full_name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                          {selectedPost.title}
                        </h2>
                        {selectedPost.topic_tags?.name && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-xl">
                            #{selectedPost.topic_tags.name}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>
                          โดย{" "}
                          <strong className="text-slate-700">
                            {selectedPost.users?.full_name || "Anonymous"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(selectedPost.created_at).toLocaleString(
                            "th-TH"
                          )}
                        </span>
                        <span>•</span>
                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-100 text-[10px]">
                          ภาคเรียน {selectedPost.semester}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={(e) => handleToggleUpvote(selectedPost.id, e)}
                    className={`flex flex-col items-center px-4 py-2 rounded-2xl border cursor-pointer transition-all ${
                      selectedPost.upvotes?.some(
                        (v: any) => v.user_id === currentUser.id
                      )
                        ? "bg-blue-50 border-blue-200 text-blue-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-500"
                    }`}
                  >
                    <span className="text-base leading-none">▲</span>
                    <span className="font-black text-xs mt-1">
                      {selectedPost.upvotes?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="text-slate-800 leading-relaxed whitespace-pre-wrap text-base font-normal">
                  {selectedPost.content}
                </div>

                {/* Google Classroom Attachments Layout */}
                {(selectedPost.image_url || selectedPost.file_url) && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      ไฟล์แนบประกอบ (Attachments)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedPost.image_url && (
                        <a
                          href={selectedPost.image_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer"
                        >
                          <div className="p-4 flex-1 min-w-0 pr-2">
                            <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-blue-600 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              รูปภาพประกอบ
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Image File
                            </div>
                          </div>
                          <div className="w-24 h-20 bg-slate-200 border-l border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={selectedPost.image_url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </a>
                      )}

                      {selectedPost.file_url && (
                        <a
                          href={selectedPost.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer"
                        >
                          <div className="p-4 flex-1 min-w-0 pr-2">
                            <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4 text-indigo-600 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              เอกสารแนบ
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Document File
                            </div>
                          </div>
                          <div className="w-24 h-20 bg-slate-100 border-l border-slate-200 flex items-center justify-center shrink-0">
                            <svg
                              className="w-8 h-8 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* VS Code Code Viewer */}
                {selectedPost.code_snippet && (
                  <CodeViewer
                    code={selectedPost.code_snippet}
                    filename="solution_snippet.code"
                  />
                )}

                {/* AI Auto-Summarizer Panel */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-600 animate-ping" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-950">
                        AI Auto-Summarizer
                      </span>
                    </div>

                    <button
                      onClick={handleSummarizeWithAI}
                      disabled={isSummarizing}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {isSummarizing
                        ? "กำลังประมวลผล..."
                        : "ให้ AI สรุปกระทู้นี้"}
                    </button>
                  </div>

                  {aiSummary && (
                    <div className="mt-4 p-6 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-white border border-indigo-100 rounded-3xl shadow-sm space-y-5">
                      <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                          <span className="text-sm font-black text-indigo-950">
                            สรุปสาระสำคัญของกระทู้โดย AI
                          </span>
                        </div>
                        {answers.some((a) => a.is_verified) ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            รับรองโดยผู้สอนแล้ว
                          </span>
                        ) : answers.length > 0 ? (
                          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                            สรุปจาก {answers.length} คำตอบ
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                            ยังไม่มีคำตอบ
                          </span>
                        )}
                      </div>

                      <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                        <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <svg
                            className="w-4 h-4 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          ประเด็นคำถามหลัก
                        </div>
                        <p className="text-xs font-bold text-slate-800 leading-relaxed">
                          {selectedPost.title}
                        </p>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs">
                        <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                          <svg
                            className="w-4 h-4 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          สรุปแนวทางแก้ไข / คำตอบ
                        </div>

                        <div className="space-y-4">
                          {answers.length > 0 ? (
                            answers
                              .filter((a) => !a.parent_id)
                              .map((ans, idx) => (
                                <div key={idx} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-800">
                                      • {ans.users?.full_name || "ผู้ตอบ"}
                                    </span>
                                    {ans.is_verified && (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold border border-emerald-200">
                                        ผู้สอนรับรอง
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-700 leading-relaxed pl-3 border-l-2 border-indigo-300 whitespace-pre-line">
                                    {ans.content}
                                  </p>
                                </div>
                              ))
                          ) : (
                            <p className="text-xs text-slate-400 italic py-1">
                              ขณะนี้ยังไม่มีผู้เข้ามาตอบคำถามในกระทู้นี้
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-[10px] text-indigo-400 text-right font-medium">
                        ประมวลผลอัตโนมัติด้วย AI Semantic Engine
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t border-slate-100 text-xs font-bold">
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className={`${
                      showReplyForm
                        ? "text-blue-700 bg-blue-50"
                        : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                    } px-4 py-2 rounded-xl transition-all flex items-center gap-1.5`}
                  >
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    {showReplyForm ? "ยกเลิกการตอบ" : "ตอบกลับกระทู้ (Reply)"}
                  </button>
                </div>
              </div>

              {/* Main Reply Form */}
              {showReplyForm && (
                <form
                  onSubmit={handleSubmitAnswer}
                  className="mb-8 bg-blue-50/60 p-6 rounded-3xl border border-blue-200/80 shadow-sm"
                >
                  <div className="font-bold text-blue-900 mb-3 text-xs flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                    เพิ่มคำตอบของคุณในกระทู้นี้
                  </div>
                  <textarea
                    required
                    rows={4}
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="พิมพ์อธิบายวิธีแก้ไขปัญหา หรือแนวคำตอบของคุณ..."
                    className="w-full border border-blue-200 bg-white rounded-2xl p-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all mb-3 shadow-inner"
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReplyForm(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition-colors shadow-md shadow-blue-500/20"
                    >
                      {isSubmitting ? "กำลังส่ง..." : "ส่งคำตอบ"}
                    </button>
                  </div>
                </form>
              )}

              {/* Answers & Nested Thread Section */}
              {answers.length > 0 && (
                <div className="mb-6 flex items-center gap-3 mt-10">
                  <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                    คำตอบและการอภิปราย ({answers.length})
                  </h3>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>
              )}

              <div className="space-y-4">
                {answers
                  .filter((a) => !a.parent_id)
                  .map((answer) => {
                    const childReplies = answers.filter(
                      (c) => c.parent_id === answer.id
                    );

                    return (
                      <div key={answer.id} className="space-y-3">
                        <div
                          className={`flex gap-4 p-6 rounded-3xl border ${
                            answer.is_verified
                              ? "bg-emerald-50/60 border-emerald-200/80 shadow-2xs"
                              : "bg-slate-50/80 border-slate-200/80"
                          }`}
                        >
                          <div className="w-10 h-10 bg-gradient-to-tr from-blue-900 to-indigo-900 text-white rounded-2xl flex items-center justify-center font-black shrink-0 shadow-md border border-blue-400/20 text-sm">
                            {answer.users?.full_name?.charAt(0) || "U"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900">
                                {answer.users?.full_name || "Anonymous"}
                              </span>

                              {answer.is_verified && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                  <svg
                                    className="w-3 h-3 text-emerald-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  รับรองโดยผู้สอน
                                </span>
                              )}

                              {/* Action Buttons ฝั่งคำตอบ */}
                              {isInstructorOrAdmin && (
                                <div className="ml-auto flex items-center gap-1.5">
                                  <button
                                    onClick={() =>
                                      handleVerifyAnswer(
                                        answer.id,
                                        answer.is_verified
                                      )
                                    }
                                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all active:scale-95 flex items-center gap-1 ${
                                      answer.is_verified
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                    }`}
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    {answer.is_verified
                                      ? "ยกเลิกการรับรอง"
                                      : "ยืนยันคำตอบ"}
                                  </button>

                                  <button
                                    title="ลบคำตอบ"
                                    onClick={() =>
                                      handleDeleteAnswer(answer.id)
                                    }
                                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all active:scale-95"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}

                              <span className="text-[10px] text-slate-400 ml-auto">
                                {new Date(answer.created_at).toLocaleString(
                                  "th-TH"
                                )}
                              </span>
                            </div>

                            <p className="text-slate-700 text-xs whitespace-pre-wrap leading-relaxed mb-3 font-normal">
                              {answer.content}
                            </p>

                            <button
                              onClick={() =>
                                setReplyToAnswerId(
                                  replyToAnswerId === answer.id
                                    ? null
                                    : answer.id
                                )
                              }
                              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 active:scale-95 transition-transform"
                            >
                              <svg
                                className="w-3 h-3 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                />
                              </svg>
                              {replyToAnswerId === answer.id
                                ? "ยกเลิก"
                                : "ตอบกลับความคิดเห็นนี้"}
                            </button>

                            {/* Nested Reply Form Input */}
                            {replyToAnswerId === answer.id && (
                              <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
                                <input
                                  type="text"
                                  value={nestedReplyContent}
                                  onChange={(e) =>
                                    setNestedReplyContent(e.target.value)
                                  }
                                  placeholder={`ตอบกลับคุณ ${
                                    answer.users?.full_name || "ผู้ตอบ"
                                  }...`}
                                  className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-2xs"
                                />
                                <button
                                  onClick={() =>
                                    handleCreateNestedReply(answer.id)
                                  }
                                  disabled={isSubmitting}
                                  className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shrink-0 shadow-xs"
                                >
                                  ส่ง
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Indented Child Nested Replies */}
                        {childReplies.length > 0 && (
                          <div className="ml-8 pl-4 border-l-2 border-indigo-200 space-y-2">
                            {childReplies.map((reply) => (
                              <div
                                key={reply.id}
                                className="bg-slate-100/80 p-4 rounded-2xl border border-slate-200/80 text-xs"
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                                    <svg
                                      className="w-3 h-3 text-slate-500"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                      />
                                    </svg>
                                    {reply.users?.full_name || "Anonymous"}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(reply.created_at).toLocaleString(
                                      "th-TH"
                                    )}
                                  </span>
                                </div>
                                <p className="text-slate-700 leading-relaxed text-xs">
                                  {reply.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400 flex-col bg-slate-50/50">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xs mb-4 text-3xl border border-slate-200">
                <svg
                  className="w-10 h-10 text-slate-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="font-bold text-sm text-slate-500">
                คลิกเลือกกระทู้เพื่ออ่านเนื้อหาและคำตอบ
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Create Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 012.828 0L20 4.828a2 2 0 010 2.828l-8.485 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    ตั้งกระทู้ถาม-ตอบใหม่
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Course FAQ Repository & Discussion Board
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSimilarPosts([]);
                  setSelectedImage(null);
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreatePost}
              className="p-6 overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between bg-blue-50/60 border border-blue-200/80 rounded-2xl px-4 py-3">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  วิชาที่โพสต์:
                </span>
                <span className="text-xs font-extrabold text-blue-900 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-2xs">
                  {selectedCourse?.course_code} — {selectedCourse?.course_name}{" "}
                  ({selectedSemester})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  หมวดหมู่บทเรียน (Topic Tag)
                </label>
                <select
                  value={newPostTagId}
                  onChange={(e) => setNewPostTagId(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-blue-600 outline-none bg-white font-medium"
                >
                  <option value="">-- ไม่ระบุแท็กบทเรียน --</option>
                  {topicTags
                    .filter((t) => t.course_id === selectedCourse?.id)
                    .map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        #{tag.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  หัวข้อคำถาม (Title) <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ระบุหัวข้อคำถามสั้นๆ ให้ครอบคลุมประเด็นสงสัย..."
                  className="w-full border border-slate-300 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-blue-600 outline-none bg-white font-medium"
                />
              </div>

              {similarPosts.length > 0 && (
                <div className="bg-amber-50/90 border border-amber-200/90 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    AI ตรวจพบคำถามคล้ายกันในภาคการศึกษานี้ (Relevance Match):
                  </div>
                  <div className="space-y-1.5">
                    {similarPosts.map((sp) => (
                      <div
                        key={sp.id}
                        onClick={() => {
                          setIsModalOpen(false);
                          handleSelectPost(sp);
                        }}
                        className="text-xs text-amber-950 hover:text-blue-700 cursor-pointer font-bold bg-white/80 border border-amber-200/60 p-2.5 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">↳ {sp.title}</span>
                        <span className="text-[10px] text-amber-800 shrink-0 ml-2">
                          อ่านคำตอบ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  รายละเอียด (Description){" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="พิมพ์อธิบายข้อสงสัยหรือบริบทเพิ่มเติม..."
                  className="w-full border border-slate-300 rounded-2xl p-3.5 text-xs focus:ring-2 focus:ring-blue-600 outline-none resize-none bg-white font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    แนบโค้ดโปรแกรม (Code Snippet)
                  </span>
                  <span className="text-[10px] text-slate-400">ถ้ามี</span>
                </label>
                <textarea
                  rows={3}
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  placeholder="// วางโค้ดที่นี่ ระบบจะแสดงผลแบบ VS Code..."
                  className="w-full border border-slate-800 rounded-2xl p-3 text-xs font-mono bg-[#1e1e1e] text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none shadow-inner"
                ></textarea>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  แนบไฟล์สื่อประกอบ (Attachments)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 p-3 rounded-2xl cursor-pointer transition-colors shadow-2xs">
                    <svg
                      className="w-5 h-5 text-blue-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">
                        {selectedImage ? selectedImage.name : "แนบรูปภาพ..."}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        PNG, JPG, GIF
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 p-3 rounded-2xl cursor-pointer transition-colors shadow-2xs">
                    <svg
                      className="w-5 h-5 text-indigo-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-700 truncate">
                        {selectedFile ? selectedFile.name : "แนบไฟล์เอกสาร..."}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        PDF, ZIP, DOCX
                      </div>
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagePreview && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSimilarPosts([]);
                    setSelectedImage(null);
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-xl disabled:opacity-50 transition-colors shadow-md flex items-center gap-2"
                >
                  {isSubmitting ? "กำลังบันทึก..." : "โพสต์กระทู้ ➔"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Topic Tags */}
      {isManageTagsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-800">
                จัดการแท็กหมวดหมู่ (#{selectedCourse?.course_code})
              </h3>
              <button
                onClick={() => setIsManageTagsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTag} className="flex gap-2 mb-4">
              <input
                required
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="ชื่อแท็ก เช่น บทที่ 1, Lab 2..."
                className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-xs"
              >
                + เพิ่ม
              </button>
            </form>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {topicTags
                .filter((t) => t.course_id === selectedCourse?.id)
                .map((tag) => (
                  <div
                    key={tag.id}
                    className="flex justify-between items-center bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl text-xs"
                  >
                    <span className="font-bold text-slate-700">
                      #{tag.name}
                    </span>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-rose-500 hover:underline text-[11px] font-bold"
                    >
                      ลบ
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Join Class */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-6">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">
              เข้าร่วมชั้นเรียน (Join Class)
            </h3>
            <form onSubmit={handleJoinCourse}>
              <input
                required
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="กรอกรหัสชั้นเรียน..."
                className="w-full border border-slate-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none mb-4 bg-slate-50 focus:bg-white font-medium"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20"
                >
                  เข้าร่วม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
