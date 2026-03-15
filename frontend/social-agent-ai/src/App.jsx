import axios from "axios";
import { useMemo, useState } from "react";
import "./App.css";

const apiUrl = "http://localhost:5000/generate-content";

const initialForm = {
  brand: "",
  product: "",
  audience: "",
  platform: "Instagram, TikTok, LinkedIn",
  tone: "Friendly, confident",
  goal: "Increase leads and sales",
  frequency: "1 post daily",
  notes: "",
};

const requiredFields = ["brand", "product", "audience", "platform", "tone"];

function ListSection({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const missingRequired = useMemo(
    () => requiredFields.filter((field) => !String(form[field] || "").trim()),
    [form],
  );

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const generate = async () => {
    if (missingRequired.length > 0) {
      setError(`Please fill: ${missingRequired.join(", ")}`);
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(apiUrl, form);
      setResult(res.data.data);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      const backendError = err?.response?.data?.error;
      setError(backendMessage || backendError || err.message || "Request failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <header>
        <p className="badge">Social Media Manager AI Agent</p>
        <h1>Plan, create, and execute social content in one click</h1>
        <p className="subhead">
          Fill in your business context and generate a practical weekly strategy,
          ready-to-post captions, stories, hashtags, and automation suggestions.
        </p>
      </header>

      <section className="card form-card">
        <p className="helper-text">
          Required: brand, product, audience, platform, tone.
        </p>

        <div className="grid">
          {Object.keys(initialForm).map((field) => (
            <label key={field} className={field === "notes" ? "full" : ""}>
              <span>
                {field}
                {requiredFields.includes(field) ? " *" : ""}
              </span>
              {field === "notes" ? (
                <textarea
                  rows={3}
                  value={form[field]}
                  onChange={updateField(field)}
                  placeholder={`Enter ${field}`}
                />
              ) : (
                <input
                  value={form[field]}
                  onChange={updateField(field)}
                  placeholder={`Enter ${field}`}
                />
              )}
            </label>
          ))}
        </div>

        <button onClick={generate} disabled={loading || missingRequired.length > 0}>
          {loading ? "Generating full social plan..." : "Generate Social Media Plan"}
        </button>

        {missingRequired.length > 0 && (
          <p className="helper-text warning">
            Missing required fields: {missingRequired.join(", ")}
          </p>
        )}

        {error && <p className="error">{error}</p>}
      </section>

      {result && (
        <section className="results">
          <section className="card">
            <h3>Strategy summary</h3>
            <p>{result.strategySummary || result.raw}</p>
          </section>

          <ListSection
            title="Profile optimization checklist"
            items={result.profileOptimization}
          />
          <ListSection title="Content pillars" items={result.contentPillars} />
          <ListSection title="Story ideas" items={result.storyIdeas} />
          <ListSection title="Community plan" items={result.communityPlan} />
          <ListSection
            title="Automation recommendations"
            items={result.automationRecommendations}
          />
          <ListSection title="Metrics to track" items={result.metricsToTrack} />

          <section className="card">
            <h3>Short ad copy</h3>
            <p>{result.shortAdCopy}</p>
          </section>

          {result.weeklyCalendar?.length ? (
            <section className="card">
              <h3>Weekly posting calendar</h3>
              <div className="calendar-list">
                {result.weeklyCalendar.map((entry) => (
                  <article key={`${entry.day}-${entry.platform}`}>
                    <h4>
                      {entry.day} · {entry.platform} · {entry.postType}
                    </h4>
                    <p>
                      <strong>Hook:</strong> {entry.hook}
                    </p>
                    <p>
                      <strong>Caption:</strong> {entry.caption}
                    </p>
                    <p>
                      <strong>CTA:</strong> {entry.cta}
                    </p>
                    <p>
                      <strong>Best time:</strong> {entry.bestTime}
                    </p>
                    <p>
                      <strong>Hashtags:</strong> {(entry.hashtags || []).join(" ")}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </section>
      )}
    </main>
  );
}
