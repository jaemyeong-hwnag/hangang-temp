import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { getHistory } from '../utils/historyStorage'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
)

export function WeeklyChart() {
  const history = getHistory()

  if (history.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 flex items-center justify-center min-h-[160px]">
        <p className="text-slate-500 text-sm text-center">
          데이터 없음
          <br />
          (7일 후 차트 표시)
        </p>
      </div>
    )
  }

  const recent = history.slice(-7)

  const labels = recent.map((e) => {
    const d = new Date(e.date)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${mm}/${dd}`
  })

  const data = {
    labels,
    datasets: [
      {
        label: '수온 (°C)',
        data: recent.map((e) => e.temp),
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        tension: 0.3,
        yAxisID: 'y',
        pointRadius: 3,
      },
      {
        label: '코스피 변동률 (%)',
        data: recent.map((e) => e.kospiRate),
        borderColor: '#f87171',
        backgroundColor: 'rgba(248, 113, 113, 0.1)',
        tension: 0.3,
        yAxisID: 'y1',
        pointRadius: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 11 },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: { color: '#334155' },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: { color: '#334155' },
        ticks: {
          color: '#60a5fa',
          font: { size: 11 },
          callback: (val: number | string) => `${val}°C`,
        },
        title: {
          display: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f87171',
          font: { size: 11 },
          callback: (val: number | string) => `${val}%`,
        },
      },
    },
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <Line data={data} options={options} />
    </div>
  )
}
