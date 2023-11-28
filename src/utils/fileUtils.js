// fileUtils.js
import { saveAs } from 'file-saver';

export const saveToFile = (data) => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, 'experiment_results.json');
};
