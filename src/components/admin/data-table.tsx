import { Card } from '@/components/ui'

interface Column {
  key: string
  header: string
  render?: (item: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  onRowClick?: (item: any) => void
}

export function DataTable({ columns, data, loading, onRowClick }: DataTableProps) {
  if (loading) {
    return (
      <Card>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr
                  key={item.id || i}
                  onClick={() => onRowClick?.(item)}
                  className={'border-b border-gray-50 transition-colors' + (onRowClick ? ' cursor-pointer hover:bg-gray-50' : '')}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-dark-navy">
                      {col.render ? col.render(item) : item[col.key] ?? '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
