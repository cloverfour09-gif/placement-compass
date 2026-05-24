import React from "react";
import { Company } from "@/types/company";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface MatchData {
  company: Company;
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  difficulty: string;
}

interface Props {
  matches: MatchData[];
}

export default function CompanyMatchAnalysis({ matches }: Props) {
  // Take top 5 for detailed view
  const topMatches = matches.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Best Opportunities</h2>
          <p className="text-muted-foreground">Top ranked companies based on your profile compatibility.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topMatches.map((match, idx) => (
          <Card key={idx} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {match.company.name || match.company.short_name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1 mt-1">{match.company.category}</CardDescription>
                </div>
                <Badge variant={match.difficulty === "Hard" ? "destructive" : match.difficulty === "Medium" ? "default" : "secondary"}>
                  {match.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Match Probability</span>
                  <span className={match.matchPercentage > 75 ? "text-emerald-600" : match.matchPercentage > 50 ? "text-amber-600" : "text-red-600"}>
                    {match.matchPercentage}%
                  </span>
                </div>
                <Progress value={match.matchPercentage} className="h-2" />
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Matching Skills</p>
                <div className="flex flex-wrap gap-1">
                  {match.matchingSkills.length > 0 ? (
                    match.matchingSkills.slice(0, 4).map((s, i) => (
                      <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                  {match.matchingSkills.length > 4 && (
                    <Badge variant="outline" className="bg-slate-100">+{match.matchingSkills.length - 4}</Badge>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Missing Skills</p>
                <div className="flex flex-wrap gap-1">
                  {match.missingSkills.length > 0 ? (
                    match.missingSkills.slice(0, 4).map((s, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None. You meet tech requirements!</span>
                  )}
                  {match.missingSkills.length > 4 && (
                    <Badge variant="outline" className="bg-slate-100">+{match.missingSkills.length - 4}</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {matches.length === 0 && (
        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed">
          <p className="text-muted-foreground">No companies found in the live database to compare against.</p>
        </div>
      )}
    </div>
  );
}
