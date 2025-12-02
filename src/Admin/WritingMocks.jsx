import React, { useMemo, useState } from "react";

export default function WritingMocks() {
  // Example mock — replace with API later
  const MOCK = [
    {
      id: "u_1001",
      fullname: "Aziza Karimova",
      username: "aziza_k",
      badge: "premium",
      checked: false,
      submittedAt: "2025-11-28T14:32:00Z",

      // Questions
      q_task11: "Task 1.1 Question text here...",
      q_task12: "Task 1.2 Question text here...",
      q_task2: "Task 2 Question text here...",

      // User answers
      a_task11: "User answer for Task 1.1 …",
      a_task12: "User answer for Task 1.2 …",
      a_task2: "User answer for Task 2 …",
    },
  ];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [filterBadge, setFilterBadge] = useState("all");

  // Scores state
  const [scores, setScores] = useState({
    task11: 0,
    task12: 0,
    task2: 0,
  });

  const [band, setBand] = useState("");

  const updateScore = (field, value) => {
    const v = Number(value);
    const newScores = { ...scores, [field]: v };
    setScores(newScores);

    // Auto band calculation (example rule)
    const total = newScores.task11 + newScores.task12 + newScores.task2;

    if (total <= 7) setBand("B1");
    else if (total <= 12) setBand("B2");
    else if (total <= 16) setBand("C1");
    else setBand("C2");
  };

  const filtered = useMemo(() => {
    return MOCK.filter((u) => {
      const q = query.toLowerCase();
      const match =
        u.id.toLowerCase().includes(q) ||
        u.fullname.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q);

      if (!match) return false;
      if (filterBadge === "premium") return u.badge === "premium";
      if (filterBadge === "normal") return u.badge === "normal";
      return true;
    });
  }, [query, filterBadge]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Writing Mocks — Reviews</h1>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by id, fullname or username..."
            className="w-72 px-3 py-2 border rounded"
          />

          <select
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All users</option>
            <option value="premium">Premium only</option>
            <option value="normal">Standard only</option>
          </select>
        </div>
      </header>

      {/* LIST */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Info</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-medium">{u.fullname}</td>

                <td className="px-4 py-4 text-sm">
                  <div>@{u.username}</div>
                  <div className="font-mono text-xs text-gray-500">{u.id}</div>

                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      u.badge === "premium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.badge === "premium" ? "Premium" : "Standard"}
                  </span>

                  {u.checked && (
                    <span className="ml-2 text-green-600 text-xs font-semibold">
                      ✔ Checked
                    </span>
                  )}
                </td>

                <td className="px-4 py-4 text-xs text-gray-500">
                  {new Date(u.submittedAt).toLocaleString()}
                </td>

                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => {
                      setSelected(u);
                      setScores({ task11: 0, task12: 0, task2: 0 });
                      setBand("");
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded text-sm"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSelected(null)}
          />

          <div className="relative bg-white p-6 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <h2 className="text-lg font-semibold mb-1">
              {selected.fullname} — {selected.id}
            </h2>
            <div className="text-xs text-gray-500 mb-5">
              @{selected.username} —{" "}
              {new Date(selected.submittedAt).toLocaleString()}
            </div>

            {/* TASK 1.1 */}
            <section className="mb-6">
              <h3 className="font-medium mb-2">Task 1.1</h3>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Question:
              </div>
              <p className="text-sm text-gray-600 mb-3">{selected.q_task11}</p>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Student Answer:
              </div>
              <p className="text-sm text-gray-700 mb-3">{selected.a_task11}</p>

              <div className="flex gap-3">
                <input
                  type="number"
                  min="0"
                  max="5"
                  placeholder="Score (0–5)"
                  className="px-3 py-2 border rounded w-32"
                  onChange={(e) => updateScore("task11", e.target.value)}
                />
              </div>
            </section>

            {/* TASK 1.2 */}
            <section className="mb-6">
              <h3 className="font-medium mb-2">Task 1.2</h3>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Question:
              </div>
              <p className="text-sm text-gray-600 mb-3">{selected.q_task12}</p>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Student Answer:
              </div>
              <p className="text-sm text-gray-700 mb-3">{selected.a_task12}</p>

              <input
                type="number"
                min="0"
                max="6"
                placeholder="Score (0–6)"
                className="px-3 py-2 border rounded w-32"
                onChange={(e) => updateScore("task12", e.target.value)}
              />
            </section>

            {/* TASK 2 */}
            <section className="mb-6">
              <h3 className="font-medium mb-2">Task 2</h3>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Question:
              </div>
              <p className="text-sm text-gray-600 mb-3">{selected.q_task2}</p>

              <div className="text-gray-700 text-sm mb-1 font-medium">
                Student Answer:
              </div>
              <p className="text-sm text-gray-700 mb-3">{selected.a_task2}</p>

              <input
                type="number"
                min="0"
                max="6"
                placeholder="Score (0–6)"
                className="px-3 py-2 border rounded w-32"
                onChange={(e) => updateScore("task2", e.target.value)}
              />
            </section>

            {/* AUTO BAND */}
            <section className="mb-6">
              <h3 className="font-medium mb-2">Overall Band</h3>

              <div className="px-3 py-2 border rounded w-40 bg-gray-50">
                {band || "–"}
              </div>
            </section>

            {/* EMAIL CHECKBOX */}
            {selected.badge === "premium" && (
              <label className="flex items-center gap-2 mb-4 text-sm">
                <input type="checkbox" /> Send result to email
              </label>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>

              <button className="px-4 py-2 bg-rose-600 text-white rounded">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
