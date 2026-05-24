import { useQuery } from "@tanstack/react-query";
import type { Company } from "@/types/company";
import { supabase } from "@/lib/supabase";
import { mockCompanies } from "@/data/mockCompanies";

async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase.from('company').select('*');
  if (error) {
    console.error('Error fetching companies:', error);
    return mockCompanies;
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    console.warn('No companies returned from Supabase; using fallback mock data.');
    return mockCompanies;
  }

  return data as Company[];
}

export function useCompanies() {
  return useQuery({ queryKey: ["companies"], queryFn: fetchCompanies });
}

export function useCompany(id: string | undefined) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: async (): Promise<Company | null> => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('company')
        .select('*')
        .eq('company_id', id)
        .single();

      if (error) {
        console.error('Error fetching company by id:', error);
        const fallback = mockCompanies.find((company) => company.company_id === id) ?? null;
        return fallback;
      }

      if (!data) {
        const fallback = mockCompanies.find((company) => company.company_id === id) ?? null;
        return fallback;
      }

      return data as Company;
    },
    enabled: !!id,
  });
}
