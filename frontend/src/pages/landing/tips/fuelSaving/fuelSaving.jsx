import Card from "../../../../components/card/card"
import "./fuelSaving.css"

import { Link } from "react-router-dom"

export default function fuelSaving(){
    return(
        <>
            <Card>
                <p>1. tipp: Fújja fel megfelelően az abroncsokat, hogy kisebb legyen az ellenállásuk</p>
                <p>2. tipp: Vegye ki az autóból a felesleges tárgyakat, hogy csökkentse az össztömeget</p>
                <p>3. tipp: Ha gyorsan megy, húzza fel az ablakokat, hogy csökkentse a légellenállást</p>
                <p>4. tipp: Ne használja feleslegesen a fűtést vagy a légkondit</p>
                <p>5. tipp: Ha több, mint 30 másodpercet kell várnia, állítsa le az autót</p>
                <p>6. tipp: Váltson megfelelő időben, ne legyen magas a fordulatszám</p>
                <p>7. tipp: Kerülje a hirtelen gyorsítást és fékezést</p>
            </Card>
            <p>Ha ezekre odafigyel, jelentősen csökkentheti az autója üzemanyag fogyasztását! </p>
        </>
    )
}