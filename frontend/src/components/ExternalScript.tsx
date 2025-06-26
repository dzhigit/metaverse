import { useEffect } from 'react';

interface ExternalScriptProps {
  src: string;
  async?: boolean;
  defer?: boolean;
}

const ExternalScript = ({ src, async = true, defer = false }: ExternalScriptProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [src, async, defer]);

  return null;
};

export default ExternalScript;