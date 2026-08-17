/** Embedding model used both when indexing content and when embedding a query. */
export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

export type SearchRecord = {
  id: string;
  title: string;
  description: string;
  content: string;
  section: string;
  href: string;
};

/** The exact text that gets turned into a vector — keep indexer and query in sync. */
export function embeddingText(r: SearchRecord): string {
  return `${r.section}. ${r.title}. ${r.description} ${r.content}`;
}

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};


export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-order",
    question: "How do I place an order?",
    answer:
      "Orders are taken personally. Call the estate on +33 5 56 00 12 34 between 10:00 and 18:00, Monday to Saturday, or send us a question through the contact form and we will call you back.",
  },
  {
    id: "faq-discount",
    question: "Is there a discount on bulk orders?",
    answer:
      "Yes — a flat 5% is taken off every bulk order of our estate cuvée, with no tiers and no negotiation. The Bulk page shows your savings live as you size the order.",
  },
  {
    id: "faq-minimum",
    question: "What is the minimum and maximum case size?",
    answer:
      "Bulk pricing starts at 10 bottles and the calculator runs up to 100 bottles. For orders larger than 100 bottles, call us and we will arrange the allocation by hand.",
  },
  {
    id: "faq-price",
    question: "How much does a bottle cost?",
    answer:
      "Cuvée Noir 2019 is €48 per bottle. With the 5% bulk discount applied, a case of 25 bottles comes to €1,140 — a saving of €60.",
  },
  {
    id: "faq-history",
    question: "Who makes the wine, and how?",
    answer:
      "Maison Noir was founded in 1897 on a quiet slope in the Médoc and is still family-run, five generations on. Every bottle is hand-picked, foot-trodden into oak, and cellared for a minimum of eighteen months before it leaves our door.",
  },
  {
    id: "faq-visit",
    question: "Can I visit the estate?",
    answer:
      "We welcome visitors at 12 Chemin des Vignes, 33250 Pauillac, France. Tastings are by appointment only — please write ahead so we can open the right bottle for you.",
  },
  {
    id: "faq-response",
    question: "How quickly will you reply to my question?",
    answer:
      "Messages sent through the contact form reach the estate immediately and are answered within one working day, Monday to Saturday, at hello@maisonnoir.wine.",
  },
];

export const SEARCH_RECORDS: SearchRecord[] = [
  {
    id: "home-hero",
    title: "Wine is for those who love to live",
    description: "The Maison Noir estate — single-vineyard wines from the Médoc.",
    content:
      "A cinematic estate cuvée poured slowly. Maison Noir makes single-vineyard wine in the Médoc, dark, patient and unhurried. Home page hero.",
    section: "Home",
    href: "/#hero",
  },
  {
    id: "home-about",
    title: "Our story — five generations of patient hands",
    description: "Founded in 1897 on a quiet slope in the Médoc.",
    content:
      "Founded in 1897 on a quiet slope in the Médoc, Maison Noir began with a single row of Cabernet Sauvignon and a promise: that wine should be made slowly, honestly, and only when the vintage deserved it. Today the estate remains family-run. Every bottle is still hand-picked, foot-trodden into oak, and cellared for a minimum of eighteen months. We do not chase trends.",
    section: "Home",
    href: "/#about",
  },
  {
    id: "home-contact",
    title: "Contact the estate",
    description: "Send your name, email and question — we answer within a day.",
    content:
      "Contact form with name, email and question. Reach the estate at hello@maisonnoir.wine or +33 5 56 00 12 34, Monday to Saturday, 10:00 to 18:00.",
    section: "Home",
    href: "/#contact",
  },
  {
    id: "bulk-page",
    title: "Bulk orders — order by the case",
    description: "A flat 5% off every bulk order of Cuvée Noir 2019.",
    content:
      "Bulk wine order calculator. Slide the quantity from 10 to 100 bottles of Cuvée Noir 2019 at €48 per bottle and watch the subtotal, 5% bulk discount, savings and total update in real time. Call us to order.",
    section: "Bulk",
    href: "/bulk",
  },
  {
    id: "footer-details",
    title: "Estate details and opening hours",
    description: "12 Chemin des Vignes, 33250 Pauillac, France.",
    content:
      "Maison Noir, 12 Chemin des Vignes, 33250 Pauillac, France. Telephone +33 5 56 00 12 34. Email hello@maisonnoir.wine. Open Monday to Saturday, 10:00 to 18:00. Please drink responsibly.",
    section: "Estate",
    href: "/#contact",
  },
  ...FAQ_ITEMS.map((item) => ({
    id: item.id,
    title: item.question,
    description: item.answer.slice(0, 110) + "…",
    content: item.answer,
    section: "FAQ",
    href: `/faq#${item.id}`,
  })),
];
