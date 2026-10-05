import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Skill } from '../../types';

interface SkillRadarProps {
  skills: Skill[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
  const radarSkills = skills.filter((s) =>
    ['Python', 'SQL', 'DSA', 'Machine Learning', 'Deep Learning', 'LLMs', 'React'].includes(s.name)
  );

  const data = radarSkills.map((s) => ({
    subject: s.name === 'Machine Learning' ? 'ML' : s.name === 'Deep Learning' ? 'Deep Learning' : s.name,
    current: s.score,
    target: s.targetScore
  }));

  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Target for AI/ML"
            dataKey="target"
            stroke="#94a3b8"
            fill="#94a3b8"
            fillOpacity={0.12}
            strokeDasharray="4 4"
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.28}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#e2e8f0',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#0f172a'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
