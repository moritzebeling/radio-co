/*
convert seconds to formatted time
*/
export function parseTime( sec ){
    let min = Math.floor(sec / 60);
    sec = Math.floor(sec - min * 60);
    sec = '00' + sec;
    return `${min}:${sec.slice(-2)}`;
}
