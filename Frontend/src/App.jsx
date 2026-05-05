import React from 'react'
import { useState } from 'react'
import Navbar from './components/navbar'
import UserInput from './components/UserInput'
import ScoreCard from './components/ScoreCard';
import EvidenceList from './components/EvidenceList';
import KpiMapping from './components/KpiMapping';
import GapAnalysis from './components/GapAnalysis';
import FollowUpQuestions from './components/FollowUpQuestions';

const App = () => {

  const [analysis, setAnalysis] = useState(null);
  return (
    <div className='bg-amber-50 min-h-screen w-full flex flex-col items-center pb-20'>
      <Navbar />
      <UserInput onAnalysisComplete={setAnalysis} />

      {analysis && (
        <div className='w-full max-w-3xl mt-8'>
          <ScoreCard score={analysis.response.score} />
          <div className="w-[680px] mx-auto pb-8">
            <EvidenceList evidence={analysis.response.evidence} />
            <KpiMapping kpiMapping={analysis.response.kpiMapping} />
            <GapAnalysis gaps={analysis.response.gapAnalysis} />
            <FollowUpQuestions followUpQuestions={analysis.response.followUpQuestions} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App