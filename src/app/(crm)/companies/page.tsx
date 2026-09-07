"use client";

import { Modal } from "@/components/modal";
import { useFeedback } from "@/components/ui/app-feedback";
import { PageHeader as Header } from "@/components/ui/page-header";
import { SearchField } from "@/components/ui/search-field";
import { TextInputField as Input } from "@/components/ui/text-input-field";
import { useEntityModal } from "@/hooks/use-entity-modal";
import { deleteCompany, upsertCompany, validateCompanyDraft } from "@/lib/crm";
import { useCRMActions, useCRMSelector } from "@/lib/store";
import type { Company } from "@/lib/types";
import { Building2, ExternalLink, MapPin, Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

type CompanyDraft = {
  name: string;
  industry: string;
  website: string;
  location: string;
  value: number;
  status: Company["status"];
};

const blankDraft: CompanyDraft = {
  name: "",
  industry: "",
  website: "",
  location: "",
  value: 0,
  status: "Prospect",
};

function companyToDraft(company: Company): CompanyDraft {
  return {
    name: company.name,
    industry: company.industry,
    website: company.website,
    location: company.location,
    value: company.value,
    status: company.status,
  };
}

export default function CompaniesPage() {
  const companies = useCRMSelector((state) => state.companies);
  const { setState } = useCRMActions();
  const { confirmAction, toast } = useFeedback();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const modal = useEntityModal<Company, CompanyDraft>({ blankDraft, toDraft: companyToDraft });

  const industries = ["All", ...new Set(companies.map((company) => company.industry))];
  const list = useMemo(
    () =>
      companies.filter(
        (company) =>
          (industry === "All" || company.industry === industry) &&
          company.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [companies, industry, query],
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validateCompanyDraft(modal.draft);
    if (error) {
      toast(error);
      return;
    }
    setState((state) => upsertCompany(state, modal.draft, modal.selected?.id));
    modal.close();
  };

  const modalTitle = modal.mode === "create" ? "Add company" : "Edit company";

  return (
    <div className="space-y-6">
      <Header
        title="Companies"
        subtitle={`${companies.length} accounts in your CRM`}
        action={
          <button className="btn btn-primary" type="button" onClick={modal.openCreate}>
            <Plus size={17} />
            Add company
          </button>
        }
      />

      <div className="panel flex flex-wrap gap-3 p-4">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search companies"
          aria-label="Search companies"
          className="relative min-w-64 flex-1"
        />
        <select
          className="field !w-auto"
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          aria-label="Filter industry"
        >
          {industries.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((company) => (
          <article className="panel p-5" key={company.id}>
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 text-[#465fff]">
                <Building2 />
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`badge ${company.status === "Customer" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {company.status}
                </span>
                <IconButton label="Edit" onClick={() => modal.openEdit(company)}>
                  <Pencil size={16} />
                </IconButton>
                <IconButton
                  label="Delete"
                  onClick={async () => {
                    if (
                      await confirmAction({
                        title: "Delete company",
                        message: `Delete ${company.name}?`,
                        confirmLabel: "Delete",
                      })
                    ) {
                      try {
                        setState((state) => deleteCompany(state, company.id));
                      } catch (error) {
                        toast(error instanceof Error ? error.message : "Unable to delete company");
                      }
                    }
                  }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </div>
            <h2 className="mt-5 text-xl font-bold">{company.name}</h2>
            <p className="muted">{company.industry}</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="muted" />
                {company.location}
              </p>
              <p className="flex items-center gap-2">
                <Users size={16} className="muted" />
                {company.contactCount} contacts
              </p>
              <a
                className="flex items-center gap-2 text-[#465fff]"
                href={`https://${company.website}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} />
                {company.website}
              </a>
            </div>
            <div className="soft mt-5 rounded-xl p-4">
              <p className="muted text-xs">Portfolio value</p>
              <p className="text-2xl font-bold">${company.value.toLocaleString("en-US")}</p>
            </div>
          </article>
        ))}
        {!list.length && (
          <p className="muted col-span-full rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
            No companies match your search.
          </p>
        )}
      </section>

      <Modal open={modal.isOpen} title={modalTitle} onClose={modal.close}>
        <form className="grid gap-4" onSubmit={save}>
          <Input label="Company name" value={modal.draft.name} onChange={(value) => modal.setDraft((current) => ({ ...current, name: value }))} />
          <Input label="Industry" value={modal.draft.industry} onChange={(value) => modal.setDraft((current) => ({ ...current, industry: value }))} />
          <Input label="Website" value={modal.draft.website} onChange={(value) => modal.setDraft((current) => ({ ...current, website: value }))} />
          <Input label="Location" value={modal.draft.location} onChange={(value) => modal.setDraft((current) => ({ ...current, location: value }))} />
          <Input
            label="Portfolio value"
            type="number"
            value={String(modal.draft.value)}
            onChange={(value) => modal.setDraft((current) => ({ ...current, value: Number(value) }))}
          />
          <label>
            <span className="mb-1 block text-sm font-semibold">Status</span>
            <select
              className="field"
              value={modal.draft.status}
              onChange={(event) => modal.setDraft((current) => ({ ...current, status: event.target.value as Company["status"] }))}
            >
              <option>Customer</option>
              <option>Prospect</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit">Save company</button>
        </form>
      </Modal>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  return (
    <button className="btn !p-2" type="button" aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}
