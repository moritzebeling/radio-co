/*
convert unix timestamp to formatted date
*/
export function parseDate( t ){
	t = new Date(t * 1000);
	return `${t.getFullYear()}-${t.getMonth()+1}-${t.getDate()} ${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
}
