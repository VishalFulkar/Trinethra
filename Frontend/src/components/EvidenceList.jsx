const signalColors = {
    positive: { bg: '#EAF3DE', text: '#3B6D11', label: 'Positive' },
    negative: { bg: '#FCEBEB', text: '#A32D2D', label: 'Negative' },
    neutral:  { bg: '#F1EFE8', text: '#5F5E5A', label: 'Neutral' }
};

const EvidenceList = ({ evidence }) => {
    if (!evidence?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <h2 className="text-base font-medium mb-3 text-slate-900">
                Extracted evidence
            </h2>
            <div className="flex flex-col gap-2.5">
                {evidence.map((item, i) => {
                    const colors = signalColors[item.signal] || signalColors.neutral;
                    return (
                        <div key={i} 
                            className="pl-3 py-2 bg-slate-50 rounded-r-lg"
                            style={{ borderLeft: `3px solid ${colors.text}` }}
                        >
                            <div className="flex gap-2 mb-1 flex-wrap">
                                <span 
                                    className="text-[11px] px-2 py-0.5 rounded-full"
                                    style={{ background: colors.bg, color: colors.text }}
                                >
                                    {colors.label}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-200">
                                    {item.dimension}
                                </span>
                            </div>
                            <p className="text-[13px] italic text-slate-900 mb-1">
                                "{item.quote}"
                            </p>
                            <p className="text-[12px] text-slate-500">
                                {item.interpretation}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EvidenceList;