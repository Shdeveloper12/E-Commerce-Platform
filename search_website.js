import ZAI from 'z-ai-web-dev-sdk';

async function searchWebsite() {
  try {
    const zai = await ZAI.create();
    
    console.log('Searching for startech.com.bd website analysis...');
    
    const searchResult = await zai.functions.invoke("web_search", {
      query: "startech.com.bd website structure product categories e-commerce Bangladesh",
      num: 10
    });
    
    console.log('Search Results:');
    console.log(JSON.stringify(searchResult, null, 2));
    
    return searchResult;
  } catch (error) {
    console.error('Search failed:', error.message);
    return null;
  }
}

searchWebsite();