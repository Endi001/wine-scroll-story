import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  question: z.string().trim().min(1, "Please enter a question").max(1000),
});

export function ContactSection() {
  const [values, setValues] = useState({ name: "", email: "", question: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (k: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Message sent. We'll be in touch soon.");
    setValues({ name: "", email: "", question: "" });
  };

  const field =
    "w-full bg-transparent border-b border-border/60 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none transition-colors";

  return (
    <section id="contact" className="relative border-t border-border/40 py-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-accent">
          Get in touch
        </p>
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
          Pour a glass. <span className="italic text-accent">Ask us anything.</span>
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Visits, private tastings, allocation requests — write to us and a
          member of the family will answer personally.
        </p>

        <form onSubmit={onSubmit} className="mt-14 space-y-10" noValidate>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Name
            </label>
            <input
              className={field}
              value={values.name}
              onChange={onChange("name")}
              maxLength={100}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              className={field}
              value={values.email}
              onChange={onChange("email")}
              maxLength={255}
              placeholder="you@domain.com"
            />
            {errors.email && <p className="mt-2 text-sm text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Question
            </label>
            <textarea
              className={`${field} min-h-32 resize-none`}
              value={values.question}
              onChange={onChange("question")}
              maxLength={1000}
              placeholder="Tell us what you'd like to know"
            />
            {errors.question && (
              <p className="mt-2 text-sm text-destructive">{errors.question}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group relative inline-flex items-center gap-3 border border-accent/70 bg-transparent px-8 py-4 text-xs uppercase tracking-[0.35em] text-accent transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send message"}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </form>
      </div>
    </section>
  );
}
