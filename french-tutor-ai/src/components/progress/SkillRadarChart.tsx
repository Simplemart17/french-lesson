import { useEffect, useRef } from 'react';

interface SkillData {
  name: string;
  level: number; // 0-100
  category: string;
}

interface SkillRadarChartProps {
  skills: SkillData[];
  size?: number;
  colors?: {
    [key: string]: string;
  };
}

const SkillRadarChart = ({
  skills,
  size = 300,
  colors = {
    speaking: '#3b82f6', // blue
    listening: '#8b5cf6', // purple
    reading: '#10b981', // green
    writing: '#ef4444', // red
    vocabulary: '#f59e0b', // yellow
    grammar: '#6366f1', // indigo
  },
}: SkillRadarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || skills.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // Number of sides (skills)
    const sides = skills.length;
    const angleStep = (Math.PI * 2) / sides;

    // Draw background grid
    const gridLevels = 5; // Number of concentric circles
    
    for (let level = 1; level <= gridLevels; level++) {
      const gridRadius = (radius * level) / gridLevels;
      
      // Draw grid circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, gridRadius, 0, Math.PI * 2);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw grid value
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round((level / gridLevels) * 100)}`, centerX, centerY - gridRadius);
    }

    // Draw axes
    skills.forEach((_, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top (subtract 90 degrees)
      
      const axisX = centerX + radius * Math.cos(angle);
      const axisY = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(axisX, axisY);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw skill labels
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      
      // Position labels slightly outside the chart
      const labelRadius = radius * 1.1;
      const labelX = centerX + labelRadius * Math.cos(angle);
      const labelY = centerY + labelRadius * Math.sin(angle);
      
      ctx.fillStyle = colors[skill.category] || '#6b7280';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(skill.name, labelX, labelY);
    });

    // Draw data
    ctx.beginPath();
    
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      
      // Calculate point position based on skill level (0-100)
      const pointRadius = (radius * skill.level) / 100;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    });
    
    // Close the path
    const firstSkill = skills[0];
    const firstAngle = -Math.PI / 2; // Start from top
    const firstPointRadius = (radius * firstSkill.level) / 100;
    const firstPointX = centerX + firstPointRadius * Math.cos(firstAngle);
    const firstPointY = centerY + firstPointRadius * Math.sin(firstAngle);
    
    ctx.lineTo(firstPointX, firstPointY);
    
    // Fill with semi-transparent color
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
    
    // Draw outline
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    skills.forEach((skill, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      
      // Calculate point position based on skill level (0-100)
      const pointRadius = (radius * skill.level) / 100;
      const pointX = centerX + pointRadius * Math.cos(angle);
      const pointY = centerY + pointRadius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
      ctx.fillStyle = colors[skill.category] || '#6b7280';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [skills, size, colors]);

  return (
    <div className="flex justify-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        className="max-w-full"
      />
    </div>
  );
};

export default SkillRadarChart;
