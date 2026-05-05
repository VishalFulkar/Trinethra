const bandColors = {
    'Need Attention': { bg: '#FCEBEB', text: '#A32D2D', border: '#F09595' },
    'Productivity': { bg: '#FAEEDA', text: '#854F0B', border: '#EF9F27' },
    'Performance': { bg: '#EAF3DE', text: '#3B6D11', border: '#97C459' }
};

const ScoreCard = ({ score }) => {
    if (!score) return null;
    const colors = bandColors[score.band] || bandColors["Productivity"];
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <p className="text-[12px] text-slate-500 mb-2">
                ⚠ AI draft — review before finalizing
            </p>
            <div className="flex items-center gap-4">
                <div 
                    className="w-[72px] h-[72px] rounded-xl flex items-center justify-center text-[36px] font-medium shrink-0"
                    style={{ background: colors.bg, border: `2px solid ${colors.border}`, color: colors.text }}
                >
                    {score.value}
                </div>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[18px] font-medium text-slate-900">
                            {score.label}
                        </span>
                        <span 
                            className="text-[12px] px-[10px] py-[2px] rounded-full border-[0.5px]"
                            style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
                        >
                            {score.band}
                        </span>
                        <span className="text-[12px] px-[10px] py-[2px] rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                            Confidence: {score.confidence}
                        </span>
                    </div>
                    <p className="text-[14px] text-slate-500 mt-2 leading-relaxed">
                        {score.justification}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScoreCard;