const FollowUpQuestions = ({ followUpQuestions }) => {
    if (!followUpQuestions?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <h2 className="text-base font-medium mb-1 text-slate-900">
                Suggested follow-up questions
            </h2>
            <p className="text-[12px] text-slate-500 mb-3">
                Ask these in the next supervisor call to fill the gaps above.
            </p>
            <div className="flex flex-col gap-2.5">
                {followUpQuestions.map((item, i) => (
                    <div key={i} className="p-[10px_12px] bg-slate-50 rounded-lg border-l-[3px] border-l-[#378ADD]">
                        <p className="text-[14px] font-medium text-slate-900 mb-1">
                            {i + 1}. {item.question}
                        </p>
                        <p className="text-[12px] text-slate-500">
                            Targets: {item.targetGap?.replace('_', ' ')} — looking for: {item.lookingFor}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FollowUpQuestions;