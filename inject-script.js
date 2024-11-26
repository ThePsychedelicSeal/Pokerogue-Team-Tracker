Object.defineProperty(window,'gameInfo',{
    set(value){
      console.log(value);
      this.__gameInfo=value;
      window.postMessage({ data: window.gameInfo.party}, "*")
    },
    get(){
      return  this.__gameInfo;
    }
});