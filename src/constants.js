export const COLORS = [
  { dot: '#1a1a1a', light: '#f0efe9', text: '#1a1a1a' },
  { dot: '#2563eb', light: '#dbeafe', text: '#1e40af' },
  { dot: '#16a34a', light: '#dcfce7', text: '#166534' },
  { dot: '#dc2626', light: '#fee2e2', text: '#991b1b' },
  { dot: '#d97706', light: '#fef3c7', text: '#92400e' },
  { dot: '#7c3aed', light: '#ede9fe', text: '#5b21b6' },
  { dot: '#db2777', light: '#fce7f3', text: '#9d174d' },
  { dot: '#0891b2', light: '#cffafe', text: '#155e75' },
]

export const WORKER_URL = 'https://list-tracker.rvanhofweegen.workers.dev'

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function formatSize(b) {
  if (b < 1024) return b + 'B'
  if (b < 1048576) return Math.round(b / 1024) + 'KB'
  return (b / 1048576).toFixed(1) + 'MB'
}

export function fileIcon(name = '') {
  const ext = (name.split('.').pop() || '').toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return '🖼'
  if (ext === 'pdf') return '📄'
  if (['doc', 'docx'].includes(ext)) return '📝'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return '📊'
  if (['zip', 'rar', 'tar', 'gz'].includes(ext)) return '📦'
  if (['mp4', 'mov', 'avi'].includes(ext)) return '🎬'
  if (['mp3', 'wav', 'aac'].includes(ext)) return '🎵'
  return '📎'
}
