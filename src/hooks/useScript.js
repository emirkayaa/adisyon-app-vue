const useScript = (url,id) => {
      const script = document.createElement("script");
  
      script.src = url;
      script.async = true;
      if(id)script.id = id;
      
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
  };
  
export default useScript;