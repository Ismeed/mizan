import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyText?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  onRowClick,
  emptyText = 'No records found',
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#1F4D36]/60 bg-[#091711]/40">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1F4D36] bg-[#12291E]/80 backdrop-blur-md">
            {columns.map((col, i) => (
              <th
                key={i}
                className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F4D36]/40 text-sm">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-gray-400 italic">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id ?? rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors duration-150 ${
                  onRowClick ? 'cursor-pointer hover:bg-[#1F4D36]/40' : 'hover:bg-[#12291E]/40'
                }`}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="py-4 px-5 text-gray-200">
                    {typeof col.accessor === 'function'
                      ? col.accessor(item)
                      : (item[col.accessor] as unknown as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
