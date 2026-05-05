const GapAnalysis = ({ gaps }) => {
    if (!gaps?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <h2 className="text-base font-medium mb-3 text-slate-900">
                Gap analysis
            </h2>
            <p className="text-[12px] text-slate-500 mb-3">
                Dimensions not covered in this transcript — ask follow-up questions to fill these gaps.
            </p>
            <div className="flex flex-col gap-2">
                {gaps.map((gap, i) => (
                    <div key={i} className="flex gap-3 p-[10px_12px] bg-[#FAEEDA] rounded-lg items-start">
                        <span className="text-[16px] shrink-0">!</span>
                        <div>
                            <span className="text-[12px] font-medium text-[#854F0B] uppercase tracking-wider">
                                {gap.dimension.replace('_', ' ')}
                            </span>
                            <p className="text-[13px] text-[#633806] mt-0.5">
                                {gap.detail}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GapAnalysis;