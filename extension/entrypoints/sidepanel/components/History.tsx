import React from 'react';
import { Card, CardContent } from '@/extension/ui';
import { getRiskColor } from './utils';
import { HistoryItem } from '@/extension/services/history';

export function History({ history, handleClearHistory, onRestoreHistory }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Analysis History</h2>
        <button onClick={handleClearHistory} className="text-xs text-red-500 hover:underline">Clear All</button>
      </div>
      {history.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground border-dashed">
          <p>No history yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item: HistoryItem) => (
            <Card key={item.id} className="overflow-hidden hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => onRestoreHistory(item)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1 overflow-hidden pr-4">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.company}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end space-y-1 shrink-0">
                  <span className="text-lg font-black">{item.score}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border capitalize ${getRiskColor(item.riskLevel)}`}>
                    {item.riskLevel}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
