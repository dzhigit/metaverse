import { useEffect } from 'react';

const DocsifyEmbed = () => {
  useEffect(() => {
    window.$docsify = {
      el: '#docsify',    
      name: 'Документация',
      repo: '',

      basePath: '/docs/',
      loadSidebar: true,
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js';
    script.setAttribute('data-origin', 'docsify');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      delete window.$docsify;
    };
  }, []);

  return (
    <div
      id="docsify"
      style={{
        height: '100%',
        padding: '1rem',
      }}
    />
  );
};

export default DocsifyEmbed;
