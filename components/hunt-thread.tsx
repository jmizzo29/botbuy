"use client";

import { useState } from "react";

export type HuntMessage = {
  id: string;
  from: "you" | "agent";
  text: string;
  at: string;
};

export function HuntThread({
  dealId,
  messages,
}: {
  dealId: string;
  messages: HuntMessage[];
}) {
  const [items, setItems] = useState(messages);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next = text.trim();
    if (!next) return;
    setPending(true);
    setError(null);
    const response = await fetch(`/api/deals/${dealId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: next }),
    });
    setPending(false);
    if (!response.ok) {
      setError("Could not send that.");
      return;
    }
    const body = (await response.json()) as { message?: HuntMessage };
    if (body.message) setItems((current) => [...current, body.message!]);
    setText("");
  }

  return (
    <section className="bb-thread" data-surface="hunt-thread">
      <h2>Agent</h2>
      <p className="bb-thread-note">
        This is the conversation. The agent posts updates here. You reply here.
        Approving money stays its own button.
      </p>
      <ol>
        {items.map((message) => (
          <li key={message.id} className={message.from === "you" ? "is-you" : "is-agent"}>
            <p className="who">{message.from === "you" ? "You" : "Agent"}</p>
            <p className="text">{message.text}</p>
            <p className="when">{message.at}</p>
          </li>
        ))}
      </ol>
      <form onSubmit={onSubmit}>
        <label htmlFor="hunt-note">Message the agent</label>
        <textarea
          id="hunt-note"
          value={text}
          maxLength={500}
          rows={3}
          placeholder="Ask for an update, or tell it what to do next."
          onChange={(event) => setText(event.target.value)}
        />
        {error ? <p className="bb-thread-error">{error}</p> : null}
        <button type="submit" disabled={pending || text.trim().length === 0}>
          {pending ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
