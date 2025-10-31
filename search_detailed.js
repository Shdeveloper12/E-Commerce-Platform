import ZAI from 'z-ai-web-dev-sdk';

async function searchDetailed() {
  try {
    const zai = await ZAI.create();
    
    console.log('Searching for detailed startech.com.bd website features...');
    
    const searchResult = await zai.functions.invoke("web_search", {
      query: "startech.com.bd website features navigation product pages shopping cart user account payment methods",
      num: 8
    });
    
    console.log('Detailed Search Results:');
    console.log(JSON.stringify(searchResult, null, 2));
    
    return searchResult;
  } catch (error) {
    console.error('Search failed:', error.message);
    return null;
  }
}

searchDetailed();