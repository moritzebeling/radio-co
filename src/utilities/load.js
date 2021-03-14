/*
load async json data
*/
export async function load( url, callback = false ){
    const res = await fetch( url );

    const data = await res.json();

    if (res.ok) {

        if( callback !== false ){
            callback();
        }

        return data;
    } else {
        throw new Error(data);
    }
}
