const KpiMapping = ({ kpiMapping }) => {
    if (!kpiMapping?.length) return null;
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
            <h2 className="text-base font-medium mb-3 text-slate-900">
                KPI mapping
            </h2>
            <div className="flex flex-col gap-2">
                {kpiMapping.map((item, i) => (
                    <div key={i} className="flex justify-between items-start p-[10px_12px] bg-slate-50 rounded-lg gap-3 flex-wrap">
                        <div>
                            <span className="text-[13px] font-medium text-slate-900">
                                {item.kpi}
                            </span>
                            <p className="text-[12px] text-slate-500 mt-0.5">
                                {item.evidence}
                            </p>
                        </div>
                        <span 
                            className="text-[11px] px-2.5 py-0.5 rounded-full shrink-0"
                            style={{
                                background: item.systemOrPersonal === 'system' ? '#EAF3DE' : '#E6F1FB',
                                color: item.systemOrPersonal === 'system' ? '#3B6D11' : '#185FA5'
                            }}
                        >
                            {item.systemOrPersonal}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KpiMapping;