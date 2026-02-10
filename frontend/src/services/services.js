export async function getCars(){
    const response = await fetch("http://localhost:3000/api/cars");
    if(!response.ok){
        const error = await response.json();
        alert(error.message);
        return;
    }
    return response.json();

}