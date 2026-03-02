import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths, subDays, eachWeekOfInterval, endOfWeek } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, Check, Zap, Target, Activity, Droplets, BookOpen, Dumbbell, Brain, Moon, Sun, Trash2, Flame, User, Crown, Settings, Palette, TrendingUp, X, BarChart3, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Habit, Profile } from "@shared/schema";

type Category = "Health & Body" | "Mind & Soul" | "Work & Growth";

const categoryColors: Record<Category, string> = {
  "Health & Body": "text-emerald-400",
  "Mind & Soul": "text-purple-400",
  "Work & Growth": "text-blue-400",
};

const habitEmojis = ["🔥", "💧", "💪", "🧠", "📚", "💻", "🧘‍♀️", "🚶‍♂️", "🥗", "🎯", "⚡", "🚀", "🎨", "🎵", "💰", "🌱"];

const motivationalQuotes = [
  "Small steps lead to big changes.",
  "Consistency beats intensity.",
  "You're building something great.",
  "One day at a time.",
  "Progress, not perfection.",
  "Keep the momentum going!",
  "Discipline is freedom.",
  "You showed up. That matters.",
  "Habits shape your future.",
  "Another brick in the wall of success.",
];

const iconMap: Record<string, React.ElementType> = {
  Dumbbell, Droplets, Moon, Brain, Sun, BookOpen, Zap, Target,
};

function getIcon(iconStr: string): React.ElementType | string {
  if (iconMap[iconStr]) return iconMap[iconStr];
  return iconStr;
}

function getStreak(completedDays: Record<string, boolean>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = subDays(today, i);
    const key = format(d, "yyyy-MM-dd");
    if (completedDays[key]) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

type ThemeInfo = {
  id: string;
  name: string;
  emoji: string;
  free?: boolean;
};

const FREE_THEME_ID = "classic-white";

const themes: ThemeInfo[] = [
  { id: "classic-white", name: "Classic White", emoji: "☀️", free: true },
  { id: "classic-dark", name: "Classic Dark", emoji: "🌑" },
  { id: "neon-noir", name: "Neon Noir", emoji: "💜" },
  { id: "arctic-pulse", name: "Arctic Pulse", emoji: "❄️" },
  { id: "lavender-haze", name: "Lavender Haze", emoji: "🔮" },
  { id: "cyber-teal", name: "Cyber Teal", emoji: "🌿" },
  { id: "ember-night", name: "Ember Night", emoji: "🔥" },
  { id: "midnight-sakura", name: "Midnight Sakura", emoji: "🌸" },
  { id: "titanium-frost", name: "Titanium Frost", emoji: "⚙️" },
  { id: "ocean-nebula", name: "Ocean Nebula", emoji: "🌊" },
  { id: "mocha-glow", name: "Mocha Glow", emoji: "☕" },
  { id: "prism-dusk", name: "Prism Dusk", emoji: "🎆" },
];

function applyTheme(id: string) {
  const el = document.documentElement;
  if (id === "classic-dark") {
    delete el.dataset.theme;
  } else {
    el.dataset.theme = id;
  }
  localStorage.setItem("hb-theme", id);
}

function getStoredTheme(): string {
  return localStorage.getItem("hb-theme") || "classic-dark";
}

function AnalyticsChart({ habits, daysInMonth, onClose }: {
  habits: Habit[];
  daysInMonth: Date[];
  onClose: () => void;
}) {
  const dailyData = useMemo(() => {
    return daysInMonth.map(date => {
      const dateStr = format(date, "yyyy-MM-dd");
      let completed = 0;
      habits.forEach(h => {
        const days = (h.completedDays as Record<string, boolean>) || {};
        if (days[dateStr]) completed++;
      });
      return { date, dateStr, day: parseInt(format(date, "d")), completed, total: habits.length };
    });
  }, [habits, daysInMonth]);

  const weeklyData = useMemo(() => {
    const weeks: { label: string; completed: number; total: number }[] = [];
    const ws = startOfMonth(daysInMonth[0]);
    const we = endOfMonth(daysInMonth[0]);
    const weekStarts = eachWeekOfInterval({ start: ws, end: we }, { weekStartsOn: 1 });
    weekStarts.forEach((weekStart, i) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      let completed = 0;
      let total = 0;
      daysInMonth.forEach(date => {
        if (date >= weekStart && date <= weekEnd) {
          habits.forEach(h => {
            const days = (h.completedDays as Record<string, boolean>) || {};
            total++;
            if (days[format(date, "yyyy-MM-dd")]) completed++;
          });
        }
      });
      weeks.push({ label: `W${i + 1}`, completed, total });
    });
    return weeks;
  }, [habits, daysInMonth]);

  const maxDaily = Math.max(1, ...dailyData.map(d => d.completed));
  const maxWeekly = Math.max(1, ...weeklyData.map(w => w.completed));

  const habitStats = useMemo(() => {
    return habits.map(h => {
      const days = (h.completedDays as Record<string, boolean>) || {};
      const completed = daysInMonth.filter(d => days[format(d, "yyyy-MM-dd")]).length;
      const rate = Math.round((completed / h.target) * 100);
      return { name: h.name, icon: h.icon, completed, target: h.target, rate: Math.min(rate, 100), streak: getStreak(days) };
    });
  }, [habits, daysInMonth]);

  const totalRate = habits.length > 0
    ? Math.round(habitStats.reduce((s, h) => s + h.rate, 0) / habits.length)
    : 0;

  const chartW = 680;
  const chartH = 160;
  const padding = 30;
  const drawW = chartW - padding * 2;
  const drawH = chartH - padding;

  const linePath = dailyData.map((d, i) => {
    const x = padding + (i / Math.max(1, dailyData.length - 1)) * drawW;
    const y = chartH - padding - (d.completed / maxDaily) * drawH;
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  const areaPath = linePath + ` L ${padding + drawW} ${chartH - padding} L ${padding} ${chartH - padding} Z`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-[780px] glass-panel rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-analytics"
      >
        <div className="p-6" style={{ background: "var(--hb-header-grad)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white">Monthly Analytics</h2>
                <p className="text-white/60 text-xs font-medium mt-0.5">{format(daysInMonth[0], "MMMM yyyy")}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="button-close-analytics">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Avg Rate</span>
              <div className="text-2xl font-black mt-0.5 text-white">{totalRate}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Active</span>
              <div className="text-2xl font-black mt-0.5 text-white">{habits.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Best Streak</span>
              <div className="text-2xl font-black mt-0.5 flex items-center gap-1 text-white">
                {Math.max(0, ...habitStats.map(h => h.streak))}
                <Flame className="w-4 h-4 text-amber-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: "var(--hb-chart-line)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--hb-text-muted)" }}>Daily Completions</span>
            </div>
            <div className="rounded-2xl p-4 overflow-x-auto custom-scrollbar" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full min-w-[500px]" style={{ height: 170 }}>
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                  const y = chartH - padding - pct * drawH;
                  return (
                    <g key={pct}>
                      <line x1={padding} y1={y} x2={chartW - padding} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray={pct === 0 ? "0" : "4 4"} />
                      <text x={padding - 8} y={y + 3} textAnchor="end" fill="var(--hb-text-muted)" fontSize="9" fontWeight="600">
                        {Math.round(maxDaily * pct)}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--hb-chart-line)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--hb-chart-line)" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <path d={areaPath} fill="url(#areaGrad)" />
                <path d={linePath} fill="none" stroke="var(--hb-chart-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />

                {dailyData.map((d, i) => {
                  const x = padding + (i / Math.max(1, dailyData.length - 1)) * drawW;
                  const y = chartH - padding - (d.completed / maxDaily) * drawH;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="3" fill="var(--hb-bg)" stroke="var(--hb-chart-line)" strokeWidth="2" />
                      {i % 3 === 0 && (
                        <text x={x} y={chartH - 5} textAnchor="middle" fill="var(--hb-text-muted)" fontSize="8" fontWeight="600">
                          {d.day}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4" style={{ color: "var(--hb-chart-line)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--hb-text-muted)" }}>Weekly Breakdown</span>
              </div>
              <div className="rounded-2xl p-4" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                <div className="flex items-end gap-2 h-[100px]">
                  {weeklyData.map((w, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold" style={{ color: "var(--hb-chart-line)" }}>{w.completed}</span>
                      <div className="w-full rounded-lg relative overflow-hidden" style={{ height: `${Math.max(8, (w.completed / maxWeekly) * 70)}px`, backgroundColor: "var(--hb-chart-fill)" }}>
                        <div className="absolute inset-0 rounded-lg" style={{ background: `linear-gradient(to top, var(--hb-chart-bar), var(--hb-chart-line))`, opacity: 0.8 }} />
                      </div>
                      <span className="text-[9px] font-bold" style={{ color: "var(--hb-text-muted)" }}>{w.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest mb-3 block" style={{ color: "var(--hb-text-muted)" }}>Habit Breakdown</span>
              <div className="space-y-2 max-h-[130px] overflow-y-auto custom-scrollbar pr-1">
                {habitStats.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                    <span className="text-sm">{h.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate" style={{ color: "var(--hb-text)" }}>{h.name}</div>
                      <div className="w-full h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${h.rate}%`, background: `linear-gradient(90deg, var(--hb-chart-line), var(--hb-chart-bar))` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-black ml-1" style={{ color: "var(--hb-chart-line)" }}>{h.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🔥");
  const [newCategory, setNewCategory] = useState<Category>("Work & Growth");
  const [newTarget, setNewTarget] = useState(20);
  const [showQuote, setShowQuote] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledRight, setScrolledRight] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    applyTheme(stored);
  }, []);

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });

  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const isFree = profile?.role !== "pro";
  const currentThemeId = isFree ? FREE_THEME_ID : (profile?.accentColor || getStoredTheme());
  const currentTheme = themes.find(t => t.id === currentThemeId) || themes[0];

  useEffect(() => {
    if (profile) {
      if (profile.role !== "pro") {
        applyTheme(FREE_THEME_ID);
      } else if (profile.accentColor) {
        applyTheme(profile.accentColor);
      }
    }
  }, [profile?.accentColor, profile?.role]);

  const profileMutation = useMutation({
    mutationFn: async (data: Partial<{ name: string; bio: string; avatarUrl: string; accentColor: string }>) => {
      const res = await apiRequest("PATCH", "/api/profile", data);
      return res.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["/api/profile"] });
      const prev = queryClient.getQueryData<Profile>(["/api/profile"]);
      if (prev) {
        queryClient.setQueryData(["/api/profile"], { ...prev, ...newData });
      }
      if (newData.accentColor) {
        applyTheme(newData.accentColor);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["/api/profile"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; category: string; target: number; icon: string; color: string; completedDays: Record<string, boolean> }) => {
      const res = await apiRequest("POST", "/api/habits", data);
      return res.json();
    },
    onMutate: async (newHabit) => {
      await queryClient.cancelQueries({ queryKey: ["/api/habits"] });
      const prev = queryClient.getQueryData<Habit[]>(["/api/habits"]);
      const tempHabit = { ...newHabit, id: Date.now() } as Habit;
      queryClient.setQueryData(["/api/habits"], [...(prev || []), tempHabit]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["/api/habits"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/habits/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["/api/habits"] });
      const prev = queryClient.getQueryData<Habit[]>(["/api/habits"]);
      queryClient.setQueryData(["/api/habits"], (old: Habit[] | undefined) =>
        (old || []).filter(h => h.id !== id)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["/api/habits"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, date }: { id: number; date: string }) => {
      const res = await apiRequest("POST", `/api/habits/${id}/toggle`, { date });
      return res.json();
    },
    onMutate: async ({ id, date }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/habits"] });
      const prev = queryClient.getQueryData<Habit[]>(["/api/habits"]);
      let wasCompleting = false;
      queryClient.setQueryData(["/api/habits"], (old: Habit[] | undefined) =>
        (old || []).map(h => {
          if (h.id !== id) return h;
          const days = { ...(h.completedDays as Record<string, boolean>) };
          if (days[date]) { delete days[date]; } else { days[date] = true; wasCompleting = true; }
          return { ...h, completedDays: days };
        })
      );
      if (wasCompleting) {
        setJustCompleted(`${id}-${date}`);
        setTimeout(() => setJustCompleted(null), 400);
      }
      return { prev };
    },
    onSuccess: (data: Habit) => {
      const days = (data.completedDays as Record<string, boolean>) || {};
      const todayStr = format(new Date(), "yyyy-MM-dd");
      if (days[todayStr]) {
        const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        setShowQuote(quote);
        setTimeout(() => setShowQuote(null), 2500);
      }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["/api/habits"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });

  const effectiveDate = isFree ? new Date() : currentDate;
  const monthStart = startOfMonth(effectiveDate);
  const monthEnd = endOfMonth(effectiveDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => {
    if (isFree) { setIsUpgradeOpen(true); return; }
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    if (isFree) { setIsUpgradeOpen(true); return; }
    setCurrentDate(subMonths(currentDate, 1));
  };

  const scrollGridHalf = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (scrolledRight) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      setScrolledRight(false);
    } else {
      const half = el.scrollWidth / 2;
      el.scrollTo({ left: half, behavior: "smooth" });
      setScrolledRight(true);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const mid = el.scrollWidth / 2;
      setScrolledRight(el.scrollLeft >= mid - 50);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [habits]);

  const handleAddHabit = () => {
    if (!newName.trim()) return;
    createMutation.mutate({
      name: newName.trim(),
      category: newCategory,
      target: newTarget,
      icon: newIcon,
      color: "",
      completedDays: {},
    });
    setIsAddOpen(false);
    setNewName("");
  };

  const habitsByCategory = useMemo(() => {
    return habits.reduce((acc, habit) => {
      const cat = habit.category as Category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(habit);
      return acc;
    }, {} as Record<Category, Habit[]>);
  }, [habits]);

  const globalStats = useMemo(() => {
    let totalTargets = 0;
    let totalCompleted = 0;
    habits.forEach(h => {
      totalTargets += h.target;
      const days = (h.completedDays as Record<string, boolean>) || {};
      const monthCompletions = daysInMonth.filter(d => days[format(d, "yyyy-MM-dd")]).length;
      totalCompleted += monthCompletions;
    });
    const completionRate = totalTargets > 0 ? Math.min(100, Math.round((totalCompleted / totalTargets) * 100)) : 0;
    return { completionRate, totalCompleted, totalTargets };
  }, [habits, daysInMonth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--hb-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "var(--hb-header-grad)" }}>
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <span className="text-sm font-medium tracking-wide" style={{ color: "var(--hb-text-muted)" }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans p-3 md:p-8 pb-24 relative w-full max-w-full" style={{ color: "var(--hb-text)", overflowX: "clip" }}>
      <div className="hb-bg-ambient" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0" aria-hidden="true">
        <div className="hb-glow-orb" style={{ width: 300, height: 300, left: "10%", top: "20%", background: "var(--hb-bg-grad1)" }} />
        <div className="hb-glow-orb" style={{ width: 250, height: 250, right: "15%", top: "60%", background: "var(--hb-bg-grad2)", animationDelay: "-4s" }} />
        <div className="hb-glow-orb" style={{ width: 200, height: 200, left: "50%", bottom: "10%", background: "var(--hb-bg-grad3)", animationDelay: "-8s" }} />
      </div>
      <div className="max-w-[1500px] mx-auto space-y-6 relative z-10">
        <AnimatePresence>
          {showQuote && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-medium tracking-wide"
              style={{ background: "var(--hb-quote-bg)" }}
              data-testid="text-motivational-quote"
            >
              {showQuote}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChartOpen && (
            <AnalyticsChart habits={habits} daysInMonth={daysInMonth} onClose={() => setIsChartOpen(false)} />
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 glass-panel rounded-3xl p-4 md:p-6 relative overflow-hidden hb-fade-up">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hb-header-grad)", opacity: 0.08 }} />

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "var(--hb-header-grad)" }}>
              <Activity className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" data-testid="text-app-title">HABEAT</h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--hb-text-muted)" }}>
                {profile?.role === "pro" ? "Pro" : "Free"} Plan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-2xl relative z-10" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
            <Button variant="ghost" size="icon" onClick={prevMonth} className={`h-9 w-9 rounded-xl text-inherit hover:bg-white/10 ${isFree ? "opacity-40" : ""}`} data-testid="button-prev-month">
              {isFree ? <Lock className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
            <div className="w-40 md:w-48 text-center flex flex-col justify-center">
              <span className="text-xs md:text-sm font-bold tracking-widest uppercase" style={{ color: "var(--hb-text-muted)" }}>{format(effectiveDate, "yyyy")}</span>
              <span className="text-base md:text-lg font-bold leading-none" data-testid="text-current-month">{format(effectiveDate, "MMMM")}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth} className={`h-9 w-9 rounded-xl text-inherit hover:bg-white/10 ${isFree ? "opacity-40" : ""}`} data-testid="button-next-month">
              {isFree ? <Lock className="w-4 h-4" /> : <ChevronRight className="w-5 h-5" />}
            </Button>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => { if (isFree) { setIsUpgradeOpen(true); } else { setIsChartOpen(true); } }}
              className="hidden lg:flex items-center gap-3 mr-2 py-1.5 px-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer"
              style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}
              data-testid="button-monthly-progress"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--hb-text-muted)" }}>Monthly</span>
                <span className="text-sm font-black leading-none mt-0.5" data-testid="text-completion-rate">{globalStats.completionRate}%</span>
              </div>
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="1 3" strokeLinecap="round" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke="var(--hb-chart-line)"
                    className="transition-all duration-700"
                    strokeWidth="4"
                    strokeDasharray="94.2"
                    strokeDashoffset={94.2 - (94.2 * globalStats.completionRate) / 100}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <button className="hb-btn-glow text-white font-semibold px-4 md:px-6 rounded-xl h-11 flex items-center gap-2 min-w-[44px]" style={{ backgroundColor: "var(--hb-accent)" }} data-testid="button-add-habit">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Habit</span>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-0" style={{ background: "var(--hb-bg)", border: "1px solid var(--hb-surface-border)", color: "var(--hb-text)" }}>
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-2xl font-bold">New Protocol</DialogTitle>
                  <DialogDescription className="sr-only">Create a new habit to track daily</DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Habit Name</Label>
                    <Input
                      placeholder="e.g. Read 20 pages..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="h-12 rounded-xl border-0"
                      style={{ background: "var(--hb-surface)", color: "var(--hb-text)", borderColor: "var(--hb-surface-border)" }}
                      data-testid="input-habit-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Select Icon / Emoji</Label>
                    <div className="grid grid-cols-8 gap-2 p-2 rounded-2xl" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                      {habitEmojis.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => setNewIcon(emoji)}
                          className={`w-8 h-8 flex items-center justify-center rounded-xl text-xl transition-all duration-150 ${newIcon === emoji ? 'scale-110' : 'hover:bg-white/10'}`}
                          style={newIcon === emoji ? { background: "var(--hb-surface-hover)", boxShadow: "0 0 0 2px var(--hb-accent)" } : undefined}
                          data-testid={`button-emoji-${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Category</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Health & Body", "Mind & Soul", "Work & Growth"] as Category[]).map(cat => (
                        <button
                          key={cat}
                          onClick={() => setNewCategory(cat)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-150 ${categoryColors[cat]}`}
                          style={{
                            background: newCategory === cat ? "var(--hb-surface-hover)" : "var(--hb-surface)",
                            border: newCategory === cat ? "1px solid var(--hb-accent)" : "1px solid var(--hb-surface-border)",
                          }}
                          data-testid={`button-category-${cat}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Monthly Target</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={31}
                        value={newTarget}
                        onChange={(e) => setNewTarget(Number(e.target.value))}
                        className="flex-1 accent-current"
                        style={{ accentColor: "var(--hb-accent)" }}
                        data-testid="input-target-slider"
                      />
                      <span className="text-lg font-extrabold w-10 text-center" data-testid="text-target-value">{newTarget}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddHabit}
                    className="hb-btn-glow w-full h-12 rounded-xl text-white font-bold transition-all duration-150"
                    style={{ backgroundColor: "var(--hb-accent)" }}
                    data-testid="button-create-habit"
                  >
                    Create Protocol
                  </button>
                </div>
              </DialogContent>
            </Dialog>

            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 overflow-hidden"
              style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}
              data-testid="button-profile"
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5" style={{ color: "var(--hb-text-muted)" }} />
              )}
            </button>
          </div>
        </header>

        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 max-h-[90vh] overflow-y-auto border-0" style={{ background: "var(--hb-bg)", border: "1px solid var(--hb-surface-border)", color: "var(--hb-text)" }}>
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-bold">Profile Settings</DialogTitle>
              <DialogDescription className="sr-only">Manage your profile, theme, and account settings</DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative group/avatar">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden shrink-0" style={{ background: "var(--hb-header-grad)" }}>
                    {profile?.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (profile?.name?.[0] || "U").toUpperCase()
                    )}
                  </div>
                  <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-150 cursor-pointer" data-testid="button-upload-avatar">
                    <Settings className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          profileMutation.mutate({ avatarUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Your name"
                    defaultValue={profile?.name || ""}
                    onBlur={(e) => profileMutation.mutate({ name: e.target.value })}
                    className="h-10 rounded-xl font-semibold border-0"
                    style={{ background: "var(--hb-surface)", color: "var(--hb-text)" }}
                    data-testid="input-profile-name"
                  />
                  <Input
                    placeholder="Short bio..."
                    defaultValue={profile?.bio || ""}
                    onBlur={(e) => profileMutation.mutate({ bio: e.target.value })}
                    className="h-9 rounded-xl text-sm border-0"
                    style={{ background: "var(--hb-surface)", color: "var(--hb-text)" }}
                    data-testid="input-profile-bio"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5" style={{ color: "var(--hb-text-muted)" }} />
                  <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Theme</Label>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                  {themes.map(t => {
                    const isLocked = isFree && !t.free;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          if (isLocked) { setIsProfileOpen(false); setIsUpgradeOpen(true); return; }
                          profileMutation.mutate({ accentColor: t.id });
                        }}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all duration-150 text-left relative ${isLocked ? "opacity-60" : ""}`}
                        style={{
                          background: currentTheme.id === t.id ? "var(--hb-surface-hover)" : "var(--hb-surface)",
                          border: currentTheme.id === t.id ? "1px solid var(--hb-accent)" : "1px solid var(--hb-surface-border)",
                        }}
                        data-testid={`button-theme-${t.id}`}
                      >
                        <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-sm">
                          {t.emoji}
                        </div>
                        <span className="text-xs font-semibold leading-tight flex-1">{t.name}</span>
                        {isLocked && <Lock className="w-3 h-3 shrink-0" style={{ color: "var(--hb-text-muted)" }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--hb-text-muted)" }}>Account</Label>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: profile?.role === "pro" ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.1)", color: profile?.role === "pro" ? "#a78bfa" : "var(--hb-text-muted)" }}>
                      {profile?.role || "free"}
                    </span>
                    <span className="text-sm" style={{ color: "var(--hb-text-muted)" }}>plan</span>
                  </div>
                  {profile?.role !== "pro" && (
                    <button
                      onClick={() => { setIsProfileOpen(false); setIsUpgradeOpen(true); }}
                      className="text-xs font-bold transition-colors"
                      style={{ color: "var(--hb-accent)" }}
                      data-testid="button-upgrade-link"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
          <DialogContent className="sm:max-w-[520px] rounded-3xl p-0 overflow-hidden border-0 max-h-[90vh] overflow-y-auto" style={{ background: "var(--hb-bg)", border: "1px solid var(--hb-surface-border)" }}>
            <div className="p-6 md:p-8 text-white relative overflow-hidden" style={{ background: "var(--hb-header-grad)" }}>
              <DialogHeader>
                <DialogTitle className="sr-only">Upgrade to Pro</DialogTitle>
                <DialogDescription className="sr-only">Compare Free and Pro plans and upgrade your subscription</DialogDescription>
              </DialogHeader>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30" style={{ background: "rgba(251,191,36,0.4)" }} />
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold">Upgrade to Pro</h2>
                  <p className="text-white/60 text-xs">Unlock the full HABEAT experience</p>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-5" style={{ color: "var(--hb-text)" }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--hb-text-muted)" }}>Free Plan</div>
                  <div className="text-xl font-extrabold">$0</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--hb-text-muted)" }}>forever</div>
                  <div className="mt-4 space-y-2.5 text-xs" style={{ color: "var(--hb-text-muted)" }}>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Current month only</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Classic White theme</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Unlimited habits</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Basic streaks</span></div>
                    <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 opacity-30 shrink-0 mt-0.5" /> <span className="opacity-40">Past month history</span></div>
                    <div className="flex items-start gap-2"><X className="w-3.5 h-3.5 opacity-30 shrink-0 mt-0.5" /> <span className="opacity-40">Premium themes</span></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl relative" style={{ background: "rgba(139,92,246,0.08)", border: "2px solid rgba(139,92,246,0.3)" }}>
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-3 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Popular
                  </span>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#a78bfa" }}>Pro Plan</div>
                  <div className="text-xl font-extrabold">$4.99</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--hb-text-muted)" }}>per month</div>
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Full month history</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>All 12 themes</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Unlimited habits</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Advanced analytics</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Export data</span></div>
                    <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>Priority support</span></div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl text-center relative" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Yearly plan</span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-lg font-extrabold">$2.99</span>
                  <span className="text-xs" style={{ color: "var(--hb-text-muted)" }}>/month</span>
                  <span className="text-xs font-bold text-emerald-400 ml-1">(Save 40%)</span>
                </div>
                <span className="text-[10px]" style={{ color: "var(--hb-text-muted)" }}>Billed $35.88/year</span>
              </div>

              <button
                className="hb-btn-glow w-full h-14 rounded-xl text-white font-bold transition-all duration-150 flex items-center justify-center gap-2 relative z-10 active:scale-95 cursor-pointer select-none"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                onClick={() => {
                  setIsUpgradeOpen(false);
                }}
                data-testid="button-subscribe"
              >
                <Sparkles className="w-4 h-4" />
                Start 7-Day Free Trial
              </button>
              <p className="text-[10px] text-center leading-relaxed" style={{ color: "var(--hb-text-muted)" }}>No charge for 7 days. Cancel anytime. Payment integration coming soon.</p>
            </div>
          </DialogContent>
        </Dialog>

        {isFree && (
          <button
            onClick={() => setIsUpgradeOpen(true)}
            className="w-full flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-150 hb-btn-glow hb-fade-up group"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}
            data-testid="banner-upgrade"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-left">
                <span className="text-sm font-bold block">Upgrade to Pro</span>
                <span className="text-[11px]" style={{ color: "var(--hb-text-muted)" }}>Unlock all themes, past months & analytics</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: "#a78bfa" }}>
              <span className="hidden sm:inline">View Plans</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        )}

        <div className="lg:hidden mb-2">
          <button
            onClick={() => { if (isFree) { setIsUpgradeOpen(true); } else { setIsChartOpen(true); } }}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-150 hb-fade-up"
            style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}
            data-testid="button-monthly-progress-mobile"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" strokeDasharray="1 3" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="var(--hb-chart-line)" className="transition-all duration-700" strokeWidth="4" strokeDasharray="94.2" strokeDashoffset={94.2 - (94.2 * globalStats.completionRate) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[9px] font-black">{globalStats.completionRate}%</span>
              </div>
              <div>
                <span className="text-sm font-bold">Monthly Progress</span>
                <span className="text-xs block" style={{ color: "var(--hb-text-muted)" }}>{globalStats.totalCompleted} / {globalStats.totalTargets} completions</span>
              </div>
            </div>
            <BarChart3 className="w-5 h-5" style={{ color: "var(--hb-text-muted)" }} />
          </button>
        </div>

        <div className="glass-panel rounded-3xl shadow-xl hb-fade-up relative" style={{ animationDelay: "0.1s" }}>
          <button
            onClick={scrollGridHalf}
            className="absolute z-[60] flex items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              right: scrolledRight ? "auto" : 12,
              left: scrolledRight ? 212 : "auto",
              top: "50%",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              background: "var(--hb-accent)",
              color: "#fff",
              boxShadow: `0 4px 20px rgba(var(--hb-accent-rgb), 0.5)`,
              border: "2px solid rgba(255,255,255,0.2)",
            }}
            data-testid="button-scroll-grid"
          >
            {scrolledRight
              ? <ChevronLeft className="w-6 h-6" />
              : <ChevronRight className="w-6 h-6" />
            }
          </button>

          <div
            ref={scrollRef}
            className="custom-scrollbar"
            data-testid="grid-scroll-container"
            style={{
              overflowX: "auto",
              overflowY: "visible",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              touchAction: "pan-x pan-y",
            }}
          >
            <div style={{ minWidth: "max-content", padding: "12px", paddingBottom: "24px" }} className="md:p-6">
              <div className="flex mb-4 md:mb-6 sticky top-0 z-40 py-2 md:py-3 rounded-2xl" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)", backdropFilter: "blur(20px)" }}>
                <div className="w-[200px] md:w-[340px] shrink-0 px-3 md:px-6 flex items-center justify-between sticky left-0 z-50 rounded-l-2xl font-semibold bg-[#e7e6ed] text-[#1c1d21]" style={{ backgroundColor: "var(--hb-nav-bg)" }}>
                  <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest" style={{ color: "var(--hb-text-muted)" }}>Habits</span>
                  <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest" style={{ color: "var(--hb-text-muted)" }}>Target</span>
                </div>
                <div className="flex flex-1 pl-2">
                  {daysInMonth.map((date, idx) => {
                    const isTodayDate = isToday(date);
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <div
                        key={date.toString()}
                        className={`w-[38px] md:w-[46px] flex flex-col items-center justify-center shrink-0 py-2 transition-all duration-150 border-r last:border-r-0 ${isTodayDate ? "text-white shadow-md scale-105 z-10 rounded-xl border-r-0" : ""}`}
                        style={{
                          borderColor: "rgba(255,255,255,0.05)",
                          ...(isTodayDate ? { background: "var(--hb-header-grad)" } : { backgroundColor: isWeekend ? "var(--hb-col-bg-alt)" : (idx % 2 === 0 ? "var(--hb-col-bg)" : undefined) }),
                        }}
                      >
                        <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest mb-1 ${isTodayDate ? 'opacity-90' : 'opacity-50'}`}>
                          {format(date, "EEE")}
                        </span>
                        <span className={`text-xs md:text-sm font-bold ${isTodayDate ? "text-white" : ""}`}>
                          {format(date, "d")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {habits.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20" style={{ color: "var(--hb-text-muted)" }}>
                  <Activity className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-semibold">No habits yet</p>
                  <p className="text-sm mt-1">Click "Add Habit" to create your first protocol</p>
                </div>
              )}

              <div className="space-y-6">
                {(Object.entries(habitsByCategory) as [Category, Habit[]][]).map(([category, categoryHabits]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-4 sticky left-0 z-20 w-fit pl-2">
                      <div className={`px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest ${categoryColors[category]}`} style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                        {category}
                      </div>
                      <div className="h-px w-32" style={{ background: "linear-gradient(to right, var(--hb-surface-border), transparent)" }} />
                    </div>

                    <div className="space-y-1.5">
                      <AnimatePresence>
                        {categoryHabits.map((habit, hIdx) => {
                          const completedDays = (habit.completedDays as Record<string, boolean>) || {};
                          const completedInMonth = daysInMonth.filter(d => completedDays[format(d, "yyyy-MM-dd")]).length;
                          const progressPercentage = Math.min(100, Math.round((completedInMonth / habit.target) * 100));
                          const IconOrEmoji = getIcon(habit.icon);
                          const isSuccess = completedInMonth >= habit.target;
                          const streak = getStreak(completedDays);

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -16 }}
                              transition={{ duration: 0.15, delay: hIdx * 0.03 }}
                              key={habit.id}
                              className="flex group relative items-center rounded-2xl transition-colors duration-150"
                              data-testid={`row-habit-${habit.id}`}
                            >
                              <div className="w-[200px] md:w-[340px] shrink-0 sticky left-0 z-20 rounded-2xl transition-all duration-200" style={{ background: "var(--hb-surface)", border: "1px solid var(--hb-surface-border)" }}>
                                <div className="flex items-center justify-between pr-4 py-2 w-full h-full">
                                  <div className="flex items-center gap-3 pl-3">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--hb-surface-hover)", border: "1px solid var(--hb-surface-border)" }}>
                                      {typeof IconOrEmoji === 'string' ? (
                                        <span className="text-lg md:text-xl">{IconOrEmoji}</span>
                                      ) : (
                                        <IconOrEmoji className="w-4 h-4 md:w-5 md:h-5" style={{ color: "var(--hb-accent)" }} />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-[13px] md:text-[15px]" data-testid={`text-habit-name-${habit.id}`}>{habit.name}</h3>
                                        {streak > 0 && (
                                          <div
                                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                                            style={{ background: "rgba(251,146,60,0.15)" }}
                                            data-testid={`text-streak-${habit.id}`}
                                          >
                                            <Flame className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] font-extrabold text-orange-400">{streak}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="relative w-5 h-5 flex items-center justify-center">
                                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" strokeDasharray="2 3" />
                                            <circle
                                              cx="18" cy="18" r="15.5" fill="none"
                                              stroke={isSuccess ? "#34d399" : "var(--hb-accent)"}
                                              className="transition-all duration-700"
                                              strokeWidth="3.5"
                                              strokeDasharray="97.4"
                                              strokeDashoffset={97.4 - (97.4 * progressPercentage) / 100}
                                              strokeLinecap="round"
                                            />
                                          </svg>
                                        </div>
                                        <span className="text-[11px] font-extrabold tracking-wider" style={{ color: "var(--hb-text-muted)" }}>{progressPercentage}%</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end justify-center mr-2 relative">
                                    <div className="text-sm font-bold flex items-center gap-1" style={{ color: isSuccess ? "#34d399" : "var(--hb-text)" }}>
                                      {completedInMonth} <span className="text-xs font-medium" style={{ color: "var(--hb-text-muted)" }}>/ {habit.target}</span>
                                    </div>
                                    {isSuccess && <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Met</span>}

                                    <button
                                      onClick={() => deleteMutation.mutate(habit.id)}
                                      className="absolute -right-3 -top-2 w-7 h-7 rounded-full shadow-md flex items-center justify-center text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-all duration-150 scale-75 hover:scale-100"
                                      style={{ background: "var(--hb-bg)", border: "1px solid rgba(244,63,94,0.3)" }}
                                      title="Delete Protocol"
                                      data-testid={`button-delete-habit-${habit.id}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-1 py-1 pl-0">
                                {daysInMonth.map((date, idx) => {
                                  const dateStr = format(date, "yyyy-MM-dd");
                                  const isCompleted = completedDays[dateStr];
                                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                  const tileKey = `${habit.id}-${dateStr}`;

                                  return (
                                    <div
                                      key={dateStr}
                                      className="w-[38px] md:w-[46px] shrink-0 flex items-center justify-center py-1 border-r last:border-r-0"
                                      style={{ borderColor: "rgba(255,255,255,0.03)", backgroundColor: isWeekend ? "var(--hb-col-bg-alt)" : (idx % 2 === 0 ? "var(--hb-col-bg)" : undefined) }}
                                    >
                                      <button
                                        onClick={() => toggleMutation.mutate({ id: habit.id, date: dateStr })}
                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-[10px] md:rounded-[12px] flex items-center justify-center transition-all duration-100 relative active:scale-90 ${
                                          isCompleted
                                            ? `hb-tile-done ${justCompleted === tileKey ? 'hb-complete-pulse' : ''}`
                                            : isWeekend ? "hb-tile-weekend" : "hb-tile-empty"
                                        }`}
                                        data-testid={`button-toggle-${habit.id}-${dateStr}`}
                                      >
                                        {isCompleted && (
                                          <Check className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                                        )}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
