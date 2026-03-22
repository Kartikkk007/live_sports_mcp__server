 const store= {};
 
 export function getCache(key){
    const entry= store[key];
    if(!entry) return null;
    if(Date.now() >entry.expiresAt){
        delete store[key];
        return null;
    }
    return entry.data;
 }
 
 export function setCache(key,data,ttlSeconds= 60){
    store[key]={
        data,
        expiresAt: Date.now() + ttlSeconds * 1000
    };
 }


