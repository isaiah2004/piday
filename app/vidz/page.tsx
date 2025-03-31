"use client";



export default function VideoGallery() {
  const videos = [
    {
      id: "3HRkKznJoZA",
      title: "The Beauty of Pi",
      description: "A visual journey through the mathematical constant π"
    },
    {
      id: "1-JAx3nUwms",
      title: "A Brief History of Pi",
      description: "The historical significance and discovery of pi"
    },
    {
      id: "VJTFfIqO4TU",
      title: "Calculating Pi with Darts",
      description: "Using Monte Carlo method to approximate pi"
    },
    {
      id: "gMlf1ELvRzc",
      title: "The First 1000 Digits of Pi",
      description: "Visualization of pi's decimal expansion"
    },
    {
      id: "8_cQwi7FWh0",
      title: "What is Pi Day?",
      description: "Every year on March 14, math geeks and others celebrate Pi Day. "
    },
    {
      id: "qeMFqkcPYcg",
      title: "Pi in Nature and Science",
      description: "How pi appears in the natural world"
    }
  ];

  return (
    <div className="container w-screen ">
      <h1>Pi Day Video Gallery</h1>
      <p className="intro">
        Explore these fascinating videos about π (pi), one of the most important
        mathematical constants.
      </p>

      <div className="video-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <h2>{video.title}</h2>
            <div className="video-container">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p>{video.description}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          margin: 0 auto;
          padding: 20px;
        }
        
        h1 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #3a3a3a;
        }
        
        .intro {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.2rem;
        }
        
        .video-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .video-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .video-card:hover {
          transform: translateY(-5px);
        }
        
        .video-card h2 {
          padding: 1rem;
          margin: 0;
          font-size: 1.2rem;
          background-color: #f5f5f5;
        }
        
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .video-card p {
          padding: 1rem;
          margin: 0;
          color: #666;
        }
      `}</style>
    </div>
  );
}
