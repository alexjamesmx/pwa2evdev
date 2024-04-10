export const optimizeImageUrl = (url) => {
  let optimizedUrl = url;
  // Function to replace the 'q' parameter with 'q=80'
  if (optimizedUrl.includes("&fit")) {
    optimizedUrl = optimizedUrl.replace(/(\\?|&)fit=[^&]*/, "&fit=crop");
  } else {
    optimizedUrl = optimizedUrl + "&fit=crop";
  }

  if (optimizedUrl.includes("?q")) {
    optimizedUrl = optimizedUrl.replace(/(\\?|&)q=[^&]*/, "$1q=80");
  }
  if (optimizedUrl.includes("&h")) {
    optimizedUrl = optimizedUrl.replace(/(\\?|&)q=[^&]*/, "&1h=300");
  } else {
    //add h=80 to the url
    optimizedUrl = optimizedUrl + "&h=300";
  }

  // Function to replace the 'fm' parameter with 'fm=webp'
  optimizedUrl = optimizedUrl.replace(/(\\?|&)fm=[^&]*/, "$1fm=webp");
  return optimizedUrl;
};
