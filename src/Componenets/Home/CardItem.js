// CardItem.js
import React from 'react';
import { Card } from 'react-bootstrap';

const CardItem = ({ card }) => {
    return (
            <Card
                className='custom-card'
                style={{
                    marginBottom: '20px',
                    boxShadow: '0 16px 100px rgba(0, 0, 0, 0.4)',
                    width: '70%',
                    border: '0 solid',
                    borderRadius: '20px'
                }}
            >
                <Card.Img
                    variant="top"
                    src={card.imageSrc}
                    style={{
                        height: '180px',
                        objectFit: 'cover',
                        width: '100%',
                        border: '0 solid',
                        borderRadius: '20px'
                    }}
                />
                <Card.Body>
                    <Card.Title><b>{card.title}</b></Card.Title>
                    <Card.Text>
                        <div>{card.content}</div>
                    </Card.Text>
                </Card.Body>
            </Card>
    );
};

export default CardItem;
