const filenamePart = (value) => String(value || '')
  .normalize('NFC')
  .replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g, '')
  .trim()
  .replace(/[\s.]+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 100);

export const getPosterDownloadFilename = (abstract) => {
  const id = filenamePart(abstract.registration?.registrationNumber)
    || filenamePart(abstract.submissionNumber) || 'E-Poster';
  const name = filenamePart(abstract.userId?.name) || 'Presenter';
  const extensionFrom = (value) => String(value || '').split(/[?#]/)[0]
    .match(/\.(pdf|docx|pptx|ppt)$/i)?.[1]?.toLowerCase();
  const extension = extensionFrom(abstract.finalPosterOriginalName)
    || extensionFrom(abstract.finalPosterPath)
    || ({
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    })[abstract.finalPosterMimeType];
  return `${id}-${name}${extension ? `.${extension}` : ''}`;
};

export const downloadPoster = async (abstract, url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('E-poster download failed');
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = getPosterDownloadFilename(abstract);
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
  }
};
