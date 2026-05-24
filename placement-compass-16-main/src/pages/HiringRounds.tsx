import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ListChecks } from "lucide-react";
import { getCompanyCategory, getCompanyDifficulty } from "@/components/placement-analyzer/scoringLogic";

function generateRounds(company: any) {
  const category = getCompanyCategory(company);
  const difficulty = getCompanyDifficulty(company);

  if (category === "Product") {
    if (difficulty === "Hard") {
      return [
        { name: "Online Assessment", tip: "Advanced DSA & System Design basics" },
        { name: "Technical (DSA)", tip: "Hard LeetCode problems" },
        { name: "System Design", tip: "Scalability, LLD, and architecture" },
        { name: "Culture & HR", tip: "Behavioral questions, leadership principles" }
      ];
    } else {
      return [
        { name: "Coding Test", tip: "Medium DSA problems" },
        { name: "Technical Interview", tip: "Core CS, language specifics" },
        { name: "Managerial Round", tip: "Past projects, conflict resolution" },
        { name: "HR Interview", tip: "Standard behavioral fit" }
      ];
    }
  } else if (category === "Startup") {
    return [
      { name: "Take-home Assignment", tip: "Build a mini full-stack app" },
      { name: "Technical Pair Programming", tip: "Live coding with team" },
      { name: "Founder / Culture Fit", tip: "Alignment with vision & agility" }
    ];
  } else {
    // Service
    return [
      { name: "Aptitude Test", tip: "Quants, logical, verbal reasoning" },
      { name: "Coding Assessment", tip: "Basic arrays, strings, SQL" },
      { name: "Technical Interview", tip: "OOPs, DBMS, CN, OS basics" },
      { name: "HR Interview", tip: "Communication skills, relocation" }
    ];
  }
}

export default function HiringRounds() {
  const { data: companies = [] } = useCompanies();

  return (
    <div>
      <PageHeader
        eyebrow="Hiring Rounds"
        title="Recruitment Process Library"
        description="Understand each company's typical hiring process and how to prepare."
      />

      {companies.length === 0 ? (
        <EmptyState icon={<ListChecks className="h-5 w-5" />} />
      ) : (
        <div className="space-y-3">
          {companies.map(c => {
            const rounds = generateRounds(c);
            const difficulty = getCompanyDifficulty(c);
            return (
              <div key={String(c.company_id)} className="rounded-xl border border-border bg-surface p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-display font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{getCompanyCategory(c)}</div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    difficulty === 'Hard' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    Difficulty: {difficulty}
                  </span>
                </div>
                <div className="grid sm:grid-cols-4 gap-2">
                  {rounds.map((r, i) => (
                    <div key={r.name} className="rounded-lg border border-border p-3 bg-surface-muted">
                      <div className="text-[10px] font-mono text-brand uppercase tracking-wider">Round {i + 1}</div>
                      <div className="text-sm font-medium mt-1">{r.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-2">{r.tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
