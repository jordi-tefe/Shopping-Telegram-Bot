import burgerimg from "../images/food-1.png";
import Pizzaimg from "../images/food-2.png";
import cocaimg from "../images/food-5.png";
import Sandwichimg from "../images/food-3.png";
import Chipsimg from "../images/food-6.png";
import cakeimg from "../images/food-4.png";

export function getData(){
    return[
        {id:1, title:"Burger", price: 100, image: burgerimg, ownerName: "Belachew Dodebdibachew",
            ownerContact: "+251912345678",},
        {id:2, title:"Pizza", price: 200, image: Pizzaimg,    ownerName: "Sara Desalegn",
            ownerContact: "+251911223344",
        },
        {id:3, title:"Coca", price: 50, image: cocaimg ,    ownerName: "Sara kelelegn",
            ownerContact: "+251911223344",
        },
        {id:4, title:"Sandwich", price: 150, image: Sandwichimg, ownerName: "Tesfaye Tefa",
            ownerContact: "+251912345678",},
        {id:5, title:"Chips", price: 100, image: Chipsimg, ownerName: "kumlachew astatke",
            ownerContact: "+251912345678",},
        {id:6, title:"Cake", price: 200, image: cakeimg,    ownerName: "chala chube chebete",
            ownerContact: "+251911223344",
        },

    ]
}
