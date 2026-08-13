export async function extractTextFromFile(buffer: Buffer, fileType: string): Promise<string> {
  if (fileType === 'application/pdf') {
    const pdfParse = (await import('pdf-parse')).default;
    const result = await pdfParse(buffer);
    return result.text.trim();
  }

  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (fileType === 'text/plain') {
    return buffer.toString('utf-8').trim();
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}
