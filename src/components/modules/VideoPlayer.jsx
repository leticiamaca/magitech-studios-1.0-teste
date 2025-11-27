export default function VideoPlayer({ videoUrl }) {
  // Extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);
  // Use YouTube's no-cookie domain and hide controls
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&showinfo=0&modestbranding=1`;

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden">
      {/* YouTube iframe */}
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
}
