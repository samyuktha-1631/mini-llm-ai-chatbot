import JSZip from 'jszip';
import { PYTHON_PROJECT_FILES } from '../data/pythonProjectFiles';

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('mini-llm-chatbot');

  if (rootFolder) {
    for (const file of PYTHON_PROJECT_FILES) {
      rootFolder.file(file.name, file.content);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mini-llm-chatbot.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
