import { useState, useEffect, useRef } from 'react';

interface ProgressChartProps {
  data: {
    date: string;
    value: number;
  }[];
  title: string;
  color?: string;
  height?: number;
  showLabels?: boolean;
}

const ProgressChart = ({
  data,
  title,
  color = '#4f46e5',
  height = 200,
  showLabels = true,
}: ProgressChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; date: string; value: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const width = canvas.width;
    const chartHeight = height - 40; // Leave space for labels
    const padding = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartWidth = width - padding.left - padding.right;

    // Find min and max values
    const maxValue = Math.max(...data.map(d => d.value)) * 1.1; // Add 10% padding

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, chartHeight);
    
    // X-axis
    ctx.moveTo(padding.left, chartHeight);
    ctx.lineTo(width - padding.right, chartHeight);
    ctx.stroke();

    // Draw horizontal grid lines
    const gridLines = 5;
    ctx.beginPath();
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= gridLines; i++) {
      const y = chartHeight - (i * (chartHeight - padding.top) / gridLines);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      
      if (showLabels) {
        // Draw y-axis labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(Math.round(maxValue * i / gridLines).toString(), padding.left - 5, y + 3);
      }
    }
    ctx.stroke();

    // Draw data points and lines
    if (data.length > 1) {
      // Draw line
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      data.forEach((point, i) => {
        const x = padding.left + (i * (chartWidth / (data.length - 1)));
        const y = chartHeight - ((point.value / maxValue) * (chartHeight - padding.top));
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw area under the line
      ctx.beginPath();
      ctx.fillStyle = `${color}20`; // 20% opacity
      
      const firstPoint = data[0];
      const firstX = padding.left;
      const firstY = chartHeight - ((firstPoint.value / maxValue) * (chartHeight - padding.top));
      
      ctx.moveTo(firstX, chartHeight);
      ctx.lineTo(firstX, firstY);
      
      data.forEach((point, i) => {
        if (i > 0) {
          const x = padding.left + (i * (chartWidth / (data.length - 1)));
          const y = chartHeight - ((point.value / maxValue) * (chartHeight - padding.top));
          ctx.lineTo(x, y);
        }
      });
      
      const lastX = padding.left + chartWidth;
      ctx.lineTo(lastX, chartHeight);
      ctx.closePath();
      ctx.fill();
    }

    // Draw data points
    data.forEach((point, i) => {
      const x = padding.left + (i * (chartWidth / (data.length - 1)));
      const y = chartHeight - ((point.value / maxValue) * (chartHeight - padding.top));
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      if (showLabels && i % Math.ceil(data.length / 5) === 0) {
        // Draw x-axis labels for some points
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        
        // Format date (assuming YYYY-MM-DD format)
        const dateObj = new Date(point.date);
        const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        
        ctx.fillText(formattedDate, x, chartHeight + 15);
      }
    });

    // Add event listeners for tooltip
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      // Find closest data point
      let closestPoint = { index: 0, distance: Infinity };
      
      data.forEach((point, i) => {
        const x = padding.left + (i * (chartWidth / (data.length - 1)));
        const distance = Math.abs(mouseX - x);
        
        if (distance < closestPoint.distance) {
          closestPoint = { index: i, distance };
        }
      });
      
      if (closestPoint.distance < 20) { // Only show tooltip if mouse is close enough
        const point = data[closestPoint.index];
        const x = padding.left + (closestPoint.index * (chartWidth / (data.length - 1)));
        const y = chartHeight - ((point.value / maxValue) * (chartHeight - padding.top));
        
        setTooltipData({
          x,
          y,
          date: point.date,
          value: point.value
        });
      } else {
        setTooltipData(null);
      }
    };
    
    const handleMouseLeave = () => {
      setTooltipData(null);
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [data, color, height, showLabels]);

  return (
    <div className="relative">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <div className="relative" style={{ height: `${height}px` }}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          width={800}
          height={height}
          style={{ width: '100%', height: '100%' }}
        />
        
        {tooltipData && (
          <div 
            className="absolute bg-white shadow-lg rounded-md p-2 text-sm pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
            style={{ 
              left: `${tooltipData.x}px`, 
              top: `${tooltipData.y - 5}px`,
            }}
          >
            <div className="font-medium">{new Date(tooltipData.date).toLocaleDateString()}</div>
            <div className="text-gray-600">{tooltipData.value}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressChart;
