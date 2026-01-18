"use client";

export default function ThemePreview() {
  return (
    <main className="min-h-screen px-8 py-12 space-y-16">

      {/* ===============================
          Brand Header
      =============================== */}
      <section>
        <h1 className="text-4xl font-bold mb-4">
          <span className="brand-info">Info</span>
          <span className="brand-plus">Plus</span>
        </h1>
        <p>
          This is a preview of the InfoPlus design system in light and dark mode.
        </p>
      </section>

      {/* ===============================
          Typography
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Typography</h2>

        <h1 className="text-4xl mb-2">Heading 1</h1>
        <h2 className="text-3xl mb-2">Heading 2</h2>
        <h3 className="text-2xl mb-2">Heading 3</h3>
        <h4 className="text-xl mb-2">Heading 4</h4>

        <p className="mt-4">
          This is normal paragraph text. It uses <strong>--text-muted</strong> for
          secondary readability across themes.
        </p>
      </section>

      {/* ===============================
          Buttons
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>

        <div className="flex gap-4 flex-wrap">
          <button className="btn-primary px-6 py-2">
            Primary Button
          </button>

          <button className="btn-outline px-6 py-2">
            Outline Button
          </button>
        </div>
      </section>

      {/* ===============================
          States / Alerts
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">States</h2>

        <p className="text-success">
          ✔ Success: Your changes have been saved successfully.
        </p>

        <p className="text-warning mt-2">
          ⚠ Warning: Please review your input before continuing.
        </p>
      </section>

      {/* ===============================
          Cards
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cards</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Card Title</h3>
            <p>
              This card uses background, border, and text tokens from the theme.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p>
              AI-generated insights appear consistently in both themes.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-2">Notifications</h3>
            <p>
              Alerts and messages remain readable and accessible.
            </p>
          </div>
        </div>
      </section>

      {/* ===============================
          Links
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Links</h2>

        <p>
          Visit our{" "}
          <a href="#">documentation</a>{" "}
          to learn more about the platform.
        </p>
      </section>

      {/* ===============================
          Background Samples
      =============================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Background Surfaces</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded"
            style={{ backgroundColor: "var(--bg-main)" }}
          >
            Main Background Surface
          </div>

          <div
            className="p-6 rounded"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            Muted Background Surface
          </div>
        </div>
      </section>

    </main>
  );
}
