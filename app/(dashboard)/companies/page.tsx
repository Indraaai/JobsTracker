import { auth } from "@/auth";
import { getCompanies } from "@/core/services/company.service";
import CompanyList from "@/components/companies/company-list";
import type { Company } from "@/db/schema/companies";

export default async function CompaniesPage() {
    const session = await auth();
    let initialCompanies: Company[] = [];

    if (session?.user?.id) {
        try {
            const rawCompanies = await getCompanies(session.user.id);
            initialCompanies = JSON.parse(JSON.stringify(rawCompanies));
        } catch {
            // fallback
        }
    }

    return <CompanyList initialData={initialCompanies} />;
}
