'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'Does ContractPilot AI replace my lawyer?',
    a: "No. It replaces the ten-minute skim your team does before every routine contract gets signed. For high-stakes agreements — M&A, complex commercial deals, litigation — you still want a human lawyer. ContractPilot AI exists for everything below that bar: vendor MSAs, SaaS terms, NDAs, service agreements, offer letters. Its findings are meant to support your own review and decision-making, not replace qualified legal advice.",
  },
  {
    q: 'How does it handle confidential contracts?',
    a: 'Contract text is sent to a large language model for analysis and stored in your workspace, isolated to your organization. You control who on your team has access. Nothing is used to train third-party models.',
  },
  {
    q: 'What file formats work?',
    a: "PDF and DOCX for uploads; plain text for paste. Scanned PDFs work if the text layer is present — pure image PDFs without a text layer aren't supported yet.",
  },
  {
    q: 'What contract types does it review?',
    a: 'It works on any prose contract in English — MSAs, SOWs, NDAs, SaaS agreements, employment contracts, leases, vendor agreements, service agreements, licenses, terms of service.',
  },
  {
    q: 'How accurate is the analysis?',
    a: "It surfaces most of what an attentive first-pass review would catch, and often more, because it doesn't get bored on page fourteen. It will occasionally miss something a specialist would catch, and it will occasionally flag something that isn't really an issue for your context. Treat every finding as a prompt to look — not a final judgment.",
  },
  {
    q: 'Can I export the findings?',
    a: 'Business and Firm plans can export a review as a shareable report, ready to attach to your negotiation notes.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'Yes — 7 days on Team, Business, and Firm, no credit card required. The Solo plan is free forever with a 3-contract-per-month limit.',
  },
  {
    q: 'Can we set our own risk standards?',
    a: "Not yet. Today, every review is measured against how similar agreements typically read. Custom playbooks — your own acceptable terms — are on the roadmap.",
  },
  {
    q: 'What does it connect to?',
    a: 'Nothing yet — you paste text or upload a PDF/DOCX directly. Email, Drive, and e-signature connections aren’t built.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section" id="faq">
      <div className="wrap wrap-narrow">
        <div className="eyebrow" style={{ marginBottom: 12 }}>Questions</div>
        <h2 className="display" style={{ fontSize: 'clamp(30px, 3.6vw, 42px)', margin: '0 0 40px' }}>
          Things people ask before they upload.
        </h2>
        <div className="faq">
          {FAQ_ITEMS.map((item, i) => (
            <div className={`faq-item${openIndex === i ? ' open' : ''}`} key={item.q}>
              <button
                className="faq-q"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span className="q-text">{item.q}</span>
                <span className="q-toggle" />
              </button>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
