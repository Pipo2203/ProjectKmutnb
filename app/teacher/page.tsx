"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected Course for Student Modal
  const [selectedCourseForStudents, setSelectedCourseForStudents] =
    useState<any>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Form States
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkTeacherSession();
  }, []);

  async function checkTeacherSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (userProfile?.role?.toLowerCase() !== "teacher") {
      alert("หน้านี้สำหรับอาจารย์ผู้สอนเท่านั้น");
      router.push("/");
      return;
    }

    setCurrentUser({ ...session.user, ...userProfile });
    fetchTeacherCourses(session.user.id);
  }

  async function fetchTeacherCourses(userId: string) {
    setLoading(true);

    // 1. ดึงวิชาทั้งหมดที่คุณครูดูแล
    const { data: coursesData } = await supabase
      .from("courses")
      .select("*, enrollments(count)")
      .order("created_at", { ascending: false });

    if (coursesData) {
      setCourses(coursesData);

      const courseIds = coursesData.map((c) => c.id);

      // 2. ดึงคำถามที่ยังไม่ได้ตอบ (is_resolved = false) ในวิชาที่อาจารย์ดูแล
      if (courseIds.length > 0) {
        const { data: postsData } = await supabase
          .from("posts")
          .select("*, courses(course_code, course_name), users(full_name)")
          .in("course_id", courseIds)
          .eq("is_resolved", false)
          .order("created_at", { ascending: false });

        if (postsData) setPendingPosts(postsData);
      }
    }
    setLoading(false);
  }

  const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  async function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const joinCode = generateJoinCode();

    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          course_code: courseCode,
          course_name: courseName,
          join_code: joinCode,
        },
      ])
      .select();

    if (error) {
      alert("สร้างวิชาไม่สำเร็จ: " + error.message);
    } else if (data) {
      await supabase
        .from("enrollments")
        .insert([{ user_id: currentUser.id, course_id: data[0].id }]);

      alert(`สร้างรายวิชาสำเร็จ! รหัสเข้าชั้นเรียนคือ: ${joinCode}`);
      setCourseCode("");
      setCourseName("");
      fetchTeacherCourses(currentUser.id);
    }
    setIsSubmitting(false);
  }

  // ดึงรายชื่อนักศึกษาที่ลงทะเบียนในวิชาที่เลือก
  async function handleOpenStudentsModal(course: any) {
    setSelectedCourseForStudents(course);
    setLoadingStudents(true);

    const { data, error } = await supabase
      .from("enrollments")
      .select("id, created_at, users(id, full_name)")
      .eq("course_id", course.id);

    if (!error && data) {
      setEnrolledStudents(data);
    }
    setLoadingStudents(false);
  }

  // ลบนักศึกษาออกจากชั้นเรียน
  async function handleRemoveStudent(
    enrollmentId: number,
    studentName: string
  ) {
    if (!confirm(`คุณต้องการลบ ${studentName} ออกจากชั้นเรียนใช่หรือไม่?`))
      return;

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollmentId);

    if (!error) {
      setEnrolledStudents(
        enrolledStudents.filter((item) => item.id !== enrollmentId)
      );
      fetchTeacherCourses(currentUser.id);
    } else {
      alert("ไม่สามารถลบนักศึกษาได้: " + error.message);
    }
  }

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        กำลังตรวจสอบสิทธิ์...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Top Bar Header - Enterprise Light Theme */}
      <header className="bg-white border-b border-slate-200 text-slate-800 px-6 py-3 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-2xs tracking-wider">
            T
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-slate-900 tracking-tight">
              Teacher Dashboard
            </span>
            <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
              จัดการชั้นเรียน
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3.5 py-1.5 rounded-lg border border-slate-200 transition-all shadow-2xs flex items-center gap-1.5 active:scale-97"
          >
            <span>กระดานถาม-ตอบ</span>
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
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-8 space-y-8">
        {/* ส่วนแสดง คำถามที่รอการตอบกลับ (Pending Questions) */}
        <section className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="font-bold text-base text-slate-900">
                คำถามที่รอการตอบกลับ ({pendingPosts.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              ดึงเฉพาะคำถามในวิชาที่คุณดูแล
            </span>
          </div>

          {pendingPosts.length === 0 ? (
            <div className="bg-white/80 p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              ไม่มีคำถามค้างตอบในขณะนี้
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all shadow-2xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {post.courses?.course_code}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.created_at).toLocaleDateString("th-TH")}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {post.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-500">
                      โดย:{" "}
                      <strong className="text-slate-700">
                        {post.users?.full_name || "นักศึกษา"}
                      </strong>
                    </span>
                    <button
                      onClick={() => router.push(`/?post=${post.id}`)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      ไปตอบคำถาม ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ส่วนจัดการวิชาเรียนเดิม */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ฟอร์มสร้างวิชาใหม่ */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
            <h3 className="font-bold text-lg text-slate-800 mb-4">
              สร้างรายวิชาใหม่
            </h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  รหัสวิชา
                </label>
                <input
                  required
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="เช่น 01012345"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  ชื่อรายวิชา
                </label>
                <input
                  required
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="เช่น Web Application Development"
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-sm text-sm"
              >
                {isSubmitting ? "กำลังสร้าง..." : "+ สร้างวิชาเรียน"}
              </button>
            </form>
          </div>

          {/* รายการวิชาทั้งหมดที่ดูแล */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-lg text-slate-800">
              รายวิชาที่คุณดูแล ({courses.length})
            </h3>
            {courses.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 text-sm">
                ยังไม่มีวิชาเรียนที่สร้างไว้
              </div>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      {course.course_code}
                    </span>
                    <h4 className="font-bold text-slate-800 text-lg mt-1">
                      {course.course_name}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400">
                        สร้างเมื่อ:{" "}
                        {new Date(course.created_at).toLocaleDateString(
                          "th-TH"
                        )}
                      </span>
                      <button
                        onClick={() => handleOpenStudentsModal(course)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        👥 นักศึกษา ({course.enrollments[0]?.count || 0} คน)
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Join Code
                      </div>
                      <div className="font-mono font-bold text-blue-900 text-lg tracking-widest">
                        {course.join_code}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal แสดงรายชื่อนักศึกษาในวิชา */}
      {selectedCourseForStudents && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  รายชื่อนักศึกษาที่เข้าร่วม
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCourseForStudents.course_code} -{" "}
                  {selectedCourseForStudents.course_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourseForStudents(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {loadingStudents ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  กำลังโหลดรายชื่อ...
                </div>
              ) : enrolledStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  ยังไม่มีนักศึกษาลงทะเบียนในวิชานี้
                </div>
              ) : (
                <div className="space-y-2">
                  {enrolledStudents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center text-xs">
                          {item.users?.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-800">
                            {item.users?.full_name || "ไม่ทราบชื่อ"}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            เข้าร่วม:{" "}
                            {new Date(item.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </div>
                        </div>
                      </div>
                      {item.users?.id !== currentUser?.id && (
                        <button
                          onClick={() =>
                            handleRemoveStudent(item.id, item.users?.full_name)
                          }
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                        >
                          ลบออก
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCourseForStudents(null)}
                className="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
