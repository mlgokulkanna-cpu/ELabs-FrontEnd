import React from "react";

interface CardProps {
    title: string;
    value: number | string;
}

const Card = ({ title, value }: CardProps) => {
    return(
        <div className="card">
            <h3 className="card-title">{title}</h3>
            <p className="card-value">{value}</p>
        </div>
    );
};

export default Card;