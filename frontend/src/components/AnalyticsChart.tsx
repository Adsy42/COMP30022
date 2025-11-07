/**
 * @file Thin wrapper around Nivo's ResponsivePie used on the admin analytics dashboard.
 * Normalizes dataset shape and palette so KPI cards and charts share the same styling.
 */

import { ResponsivePie } from '@nivo/pie'

interface ChartProps {
  data: {
    label: string
    count: number
  }[]
  type: 'single' | 'multi'
}

export function AnalyticsChart({ data, type }: ChartProps) {
  const chartData = data.map(item => ({
    id: item.label,
    label: item.label,
    value: item.count,
  }))

  // Custom color palette
  const customColors = [
    '#0ea5e9', // sky blue
    '#22c55e', // green
    '#8b5cf6', // violet
    '#f97316', // orange
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f43f5e', // rose
    '#facc15', // yellow
    '#6366f1', // indigo
  ]

  return (
    <div className="h-[300px]">
      <ResponsivePie
        data={chartData}
        margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
        innerRadius={type === 'multi' ? 0.6 : 0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={customColors}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#4b5563"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsRadiusOffset={0.6}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        enableArcLinkLabels={true}
        motionConfig="gentle"
        transitionMode="startAngle"
      />
    </div>
  )
}
