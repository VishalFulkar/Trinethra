import { useState } from "react";
import samples from "../../../Backend/src/data/sample-transcript.json";

const UserInput = ({ onAnalysisComplete }) => {
    const [val, setVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!val.trim()) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:3001/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: val })
            });

            const data = await res.json();

            if (data.error) throw new Error(data.error);

            onAnalysisComplete(data);
        } catch (err) {
            setError(err.message || "Something went wrong. Is Ollama running?");
        } finally {
            setLoading(false);
        }
    };

    const loadSample = (transcript) => {
        setVal(transcript);
        setError("");
    };

    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 mt-10 px-8 py-8 bg-white w-full max-w-3xl">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
                Supervisor Transcript
            </h1>
            <p className="text-sm text-gray-500 mb-4">
                Paste the supervisor call transcript below. Plain text only — no formatting needed.
            </p>

            <div className="flex gap-2 mb-4">
                <span className="text-sm text-gray-500 self-center">Load sample:</span>
                {samples.transcripts.map(t => (
                    <button
                        key={t.id}
                        onClick={() => loadSample(t.transcript)}
                        className="text-sm px-3 py-1 rounded-full border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white transition-colors"
                    >
                        {t.fellow.name}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder="Paste transcript here..."
                    rows={10}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-900"
                />

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading || !val.trim()}
                    className="self-end px-6 py-2 bg-blue-900 text-white rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
                >
                    {loading ? "Analyzing... (30-60s)" : "Run Analysis"}
                </button>
            </form>
        </div>
    );
};

export default UserInput;