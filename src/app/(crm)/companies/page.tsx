"use client";

import { Modal } from "@/components/modal";
import { useFeedback } from "@/components/ui/app-feedback";
import { PageHeader as Header } from "@/components/ui/page-header";
import { TextInputField as Input } from "@/components/ui/text-input-field";
import { deleteCompany, upsertCompany, validateCompanyDraft } from "@/lib/crm";
import { useCRMActions, useCRMSelector } from "@/lib/store";
import type { Company } from "@/lib/types";
import { Building2, ExternalLink, MapPin, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";

type CompanyForm = {
  name: string;
  industry: string;
  website: string;
  location: string;
  value: number;
  status: Company["status"];
};

const blank: CompanyForm = {
  name: "",
  industry: "",
  website: "",
  location: "",
  value: 0,
  status: "Prospect",
};

export default function CompaniesPage() {
  const companies = useCRMSelector((state) => state.companies);
  const { setState } = useCRMActions();
  const { confirmAction, toast } = useFeedback();
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const [form, setForm] = useState<CompanyForm>(blank);

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

  const open = (kind: "add" | "edit", company?: Company) => {
    setSelected(company ?? null);
    setForm(
      company
        ? {
            name: company.name,
            industry: company.industry,
            website: company.website,
            location: company.location,
            value: company.value,
            status: company.status,
          }
        : blank,
    );
    setModal(kind);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const error = validateCompanyDraft(form);
    if (error) {
      toast(error);
      return;
    }
    setState((state) => upsertCompany(state, form, selected?.id));
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <Header
        title="Companies"
        subtitle={`${companies.length} accounts in your CRM`}
        action={
          <button className="btn btn-primary" type="button" onClick={() => open("add")}>
            <Plus size={17} />
            Add company
          </button>
        }
      />

      <div className="panel flex flex-wrap gap-3 p-4">
        <div className="relative min-w-64 flex-1">
          <Search size={18} className="muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            className="field !pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search companies"
            aria-label="Search companies"
          />
        </div>
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
                <IconButton label="Edit" onClick={() => open("edit", company)}>
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

      <Modal
        open={!!modal}
        title={modal === "add" ? "Add company" : "Edit company"}
        onClose={() => setModal(null)}
      >
        <form className="grid gap-4" onSubmit={save}>
          <Input label="Company name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Input label="Industry" value={form.industry} onChange={(value) => setForm((current) => ({ ...current, industry: value }))} />
          <Input label="Website" value={form.website} onChange={(value) => setForm((current) => ({ ...current, website: value }))} />
          <Input label="Location" value={form.location} onChange={(value) => setForm((current) => ({ ...current, location: value }))} />
          <Input
            label="Portfolio value"
            type="number"
            value={String(form.value)}
            onChange={(value) => setForm((current) => ({ ...current, value: Number(value) }))}
          />
          <label>
            <span className="mb-1 block text-sm font-semibold">Status</span>
            <select
              className="field"
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Company["status"] }))}
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
