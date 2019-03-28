import React from "react";
import UpdateItem from "../components/UpdateItem";

const Sell = ({query: {id}}) => (
    <div>
        <UpdateItem id={id}/>
    </div>
);
export default Sell;
