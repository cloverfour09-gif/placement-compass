import React from "react";
import { Company } from "@/types/company";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface MatchData {
  company: Company;
  matchPercentage: number;
  eligibility: string;
}

interface Props {
  matches: MatchData[];
}

export default function EligibilityChecker({ matches }: Props) {
  
  const getEligibilityIcon = (status: string) => {
    switch(status) {
      case "Eligible": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "Not Eligible": return <XCircle className="w-5 h-5 text-red-500" />;
      case "Partially Eligible": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return null;
    }
  };

  const getEligibilityBadge = (status: string) => {
    switch(status) {
      case "Eligible": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Eligible</Badge>;
      case "Not Eligible": return <Badge variant="destructive">Not Eligible</Badge>;
      case "Partially Eligible": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Partially Eligible</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Eligibility Status</h2>
        <p className="text-muted-foreground">Check your qualification status for top companies based on academic and technical criteria.</p>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-950 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900">
            <TableRow>
              <TableHead className="w-[300px]">Company</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Match %</TableHead>
              <TableHead className="text-right">Eligibility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.slice(0, 10).map((match, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {getEligibilityIcon(match.eligibility)}
                    <span>{match.company.name || match.company.short_name}</span>
                  </div>
                </TableCell>
                <TableCell>{match.company.category || "General"}</TableCell>
                <TableCell>
                  <span className="font-semibold">{match.matchPercentage}%</span>
                </TableCell>
                <TableCell className="text-right">
                  {getEligibilityBadge(match.eligibility)}
                </TableCell>
              </TableRow>
            ))}
            {matches.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  No company data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
